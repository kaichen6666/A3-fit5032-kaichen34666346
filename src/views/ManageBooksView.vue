<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Manage Books</h1>

    <!-- Export -->
    <!-- BR (E.4): Export -->
    <div class="text-center mb-4">
      <button class="btn btn-primary me-2" @click="exportCSV">Export CSV</button>
      <button class="btn btn-secondary" @click="exportPDF">Export PDF</button>
    </div>

    <!-- Three chart -->
    <!-- BR (F.1): Innovation-Interactive Charts -->
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <div class="card p-3">
          <h5 class="card-title text-center">Age Group vs Count</h5>
          <canvas ref="chartAge" style="max-width:100%;"></canvas>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div class="card p-3">
          <h5 class="card-title text-center">Source vs Count</h5>
          <canvas ref="chartSource" style="max-width:100%;"></canvas>
        </div>
      </div>

      <div class="col-md-12 mb-3">
        <div class="card p-3">
          <h5 class="card-title text-center">Type vs Count</h5>
          <canvas ref="chartType" style="max-width:100%;"></canvas>
        </div>
      </div>
    </div>

    <!-- Book List -->
    <div v-if="books.length">
      <div v-for="book in books" :key="book.id" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ book.name }}</h5>
          <p class="card-text">ISBN: {{ book.isbn }}</p>

          <!-- Edit input -->
          <input type="text" v-model="book.name" placeholder="Update Name" class="form-control mb-2" />
          <input type="number" v-model.number="book.isbn" placeholder="Update ISBN" class="form-control mb-2" />

          <select v-model="book.source" class="form-select mb-2">
            <option value="" disabled>-- Source --</option>
            <option value="Donated">Donated</option>
            <option value="Institution Purchase">Institution Purchase</option>
            <option value="Library Borrow">Library Borrow</option>
          </select>

          <select v-model="book.type" class="form-select mb-2">
            <option value="" disabled>-- Type --</option>
            <option value="Textbook">Textbook</option>
            <option value="Research Report">Research Report</option>
            <option value="Guidebook">Guidebook</option>
            <option value="Story Book">Story Book</option>
          </select>

          <select v-model="book.ageGroup" class="form-select mb-2">
            <option value="" disabled>-- Suitable Age Group --</option>
            <option value="Children (6-12)">Children (6-12)</option>
            <option value="Teenagers (13-18)">Teenagers (13-18)</option>
            <option value="Adults (19-60)">Adults (19-60)</option>
            <option value="Seniors (60+)">Seniors (60+)</option>
          </select>

          <div class="mt-2 d-flex justify-content-between">
            <button class="btn btn-success" @click="updateBook(book)">Update</button>
            <button class="btn btn-danger" @click="deleteBook(book.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center text-muted">No books found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../main.js";
import Chart from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

// ----------------- reactive data -----------------
const books = ref([]);
const chartAge = ref(null);
const chartSource = ref(null);
const chartType = ref(null);
let chartAgeInstance = null;
let chartSourceInstance = null;
let chartTypeInstance = null;

// ----------------- helper functions -----------------
const countBy = (list, key, buckets = null) => {
  const counts = {};
  if (buckets && Array.isArray(buckets)) buckets.forEach(b => counts[b] = 0);

  list.forEach(item => {
    const val = item[key] ?? "";
    if (buckets && Array.isArray(buckets)) {
      if (counts.hasOwnProperty(val)) counts[val]++;
      else counts["Other"] = (counts["Other"] || 0) + 1;
    } else {
      counts[val] = (counts[val] || 0) + 1;
    }
  });

  return counts;
};

const defaultColors = [
  "#4f46e5","#3b82f6","#06b6d4","#10b981","#84cc16",
  "#f59e0b","#f97316","#ef4444","#ec4899","#8b5cf6"
];

const getColors = (n) => {
  const out = [];
  for (let i=0;i<n;i++) out.push(defaultColors[i % defaultColors.length]);
  return out;
};

// ----------------- Firebase actions -----------------
const fetchBooks = async () => {
  try {
    const snapshot = await getDocs(collection(db, "books"));
    books.value = snapshot.docs.map(d => {
      const data = d.data() || {};
      return {
        id: d.id,
        name: data.name ?? "",
        isbn: data.isbn ?? 0,
        source: data.source ?? "",
        type: data.type ?? "",
        ageGroup: data.ageGroup ?? ""
      };
    });
    updateAllCharts();
  } catch (err) {
    console.error("fetchBooks error:", err);
  }
};

const updateBook = async (book) => {
  try {
    const refDoc = doc(db, "books", book.id);
    await updateDoc(refDoc, {
      name: book.name,
      isbn: Number(book.isbn || 0),
      source: book.source || "",
      type: book.type || "",
      ageGroup: book.ageGroup || ""
    });
    alert("Book updated successfully");
    await fetchBooks();
  } catch (err) {
    console.error("updateBook error:", err);
    alert("Update failed: " + (err.message || err));
  }
};

const deleteBook = async (id) => {
  try {
    const refDoc = doc(db, "books", id);
    await deleteDoc(refDoc);
    alert("Book deleted successfully");
    await fetchBooks();
  } catch (err) {
    console.error("deleteBook error:", err);
    alert("Delete failed: " + (err.message || err));
  }
};

// ----------------- Export CSV -----------------
const exportCSV = () => {
  if (!books.value.length) {
    alert("No books to export.");
    return;
  }
  const headers = ["Name","ISBN","Source","Type","AgeGroup"];
  const rows = books.value.map(b => [
    `${(b.name||"").replace(/"/g,'""')}`,
    b.isbn ?? "",
    `${(b.source||"").replace(/"/g,'""')}`,
    `${(b.type||"").replace(/"/g,'""')}`,
    `${(b.ageGroup||"").replace(/"/g,'""')}`,
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "books.csv";
  link.click();
};

// ----------------- Export PDF -----------------
const exportPDF = async () => {
  if (!books.value.length) {
    alert("No books to export.");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Books Report", 14, 20);

  // Table
  const headers = [["Name", "ISBN", "Source", "Type", "Age Group"]];
  const rows = books.value.map(b => [
    b.name || "",
    b.isbn ?? "",
    b.source || "",
    b.type || "",
    b.ageGroup || ""
  ]);

  doc.autoTable({
    head: headers,
    body: rows,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [63, 81, 181], textColor: 255 },
  });

  let yOffset = doc.lastAutoTable.finalY + 10;

  // Charts
  const chartRefs = [chartAge.value, chartSource.value, chartType.value];
  for (let i = 0; i < chartRefs.length; i++) {
    if (!chartRefs[i]) continue;
    const canvas = await html2canvas(chartRefs[i], { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth() - 28;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (yOffset + pdfHeight > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      yOffset = 20;
    }

    doc.addImage(imgData, "PNG", 14, yOffset, pdfWidth, pdfHeight);
    yOffset += pdfHeight + 10;
  }

  doc.save("books_report.pdf");
};

// ----------------- Charts -----------------
const updateAllCharts = () => {
  updateAgeChart();
  updateSourceChart();
  updateTypeChart();
};

const updateAgeChart = () => {
  if (!chartAge.value) return;
  const ageBuckets = ["Children (6-12)", "Teenagers (13-18)", "Adults (19-60)", "Seniors (60+)", "Other"];
  const counts = countBy(books.value, "ageGroup", ageBuckets);
  const labels = Object.keys(counts);
  const data = labels.map(l => counts[l] || 0);
  const colors = getColors(labels.length);

  if (chartAgeInstance) {
    chartAgeInstance.data.labels = labels;
    chartAgeInstance.data.datasets[0].data = data;
    chartAgeInstance.update();
  } else {
    chartAgeInstance = new Chart(chartAge.value, {
      type: "bar",
      data: { labels, datasets: [{ label: "Number of books", data, backgroundColor: colors }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }
};

const updateSourceChart = () => {
  if (!chartSource.value) return;
  const counts = countBy(books.value, "source");
  const labels = Object.keys(counts);
  const data = labels.map(l => counts[l] || 0);
  const colors = getColors(labels.length);

  if (chartSourceInstance) {
    chartSourceInstance.data.labels = labels;
    chartSourceInstance.data.datasets[0].data = data;
    chartSourceInstance.update();
  } else {
    chartSourceInstance = new Chart(chartSource.value, {
      type: "pie",
      data: { labels, datasets: [{ data, backgroundColor: colors }] },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
  }
};

const updateTypeChart = () => {
  if (!chartType.value) return;
  const counts = countBy(books.value, "type");
  const labels = Object.keys(counts);
  const data = labels.map(l => counts[l] || 0);
  const colors = getColors(labels.length);

  if (chartTypeInstance) {
    chartTypeInstance.data.labels = labels;
    chartTypeInstance.data.datasets[0].data = data;
    chartTypeInstance.update();
  } else {
    chartTypeInstance = new Chart(chartType.value, {
      type: "bar",
      data: { labels, datasets: [{ label: "Number of books", data, backgroundColor: colors }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }
};

// ----------------- Lifecycle -----------------
onMounted(() => { fetchBooks(); });

onBeforeUnmount(() => {
  if (chartAgeInstance) { chartAgeInstance.destroy(); chartAgeInstance = null; }
  if (chartSourceInstance) { chartSourceInstance.destroy(); chartSourceInstance = null; }
  if (chartTypeInstance) { chartTypeInstance.destroy(); chartTypeInstance = null; }
});
</script>

<style scoped>
.card {
  max-width: 900px;
  margin: auto;
}
</style>
