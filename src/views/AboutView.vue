<template>
  <div class="about">
    <!-- ==========================
         Interactive Data Tables Section
    =========================== -->
    <section class="tables-section">
      <h1>📊 Nutrition Education Data</h1>

      <!-- Table 1: Public Health Campaigns -->
      <div class="card mb-5 p-3 shadow-sm">
        <h4 class="mb-3">Public Health Campaigns</h4>
        <table id="campaignTable" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Region</th>
              <th>Target Group</th>
              <th>Year</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th><input type="text" placeholder="Search campaign" /></th>
              <th><input type="text" placeholder="Search region" /></th>
              <th><input type="text" placeholder="Search target group" /></th>
              <th><input type="text" placeholder="Search year" /></th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="(campaign, index) in campaigns" :key="index">
              <td>{{ campaign.name }}</td>
              <td>{{ campaign.region }}</td>
              <td>{{ campaign.target }}</td>
              <td>{{ campaign.year }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table 2: Nutrition Programs -->
      <div class="card p-3 shadow-sm">
        <h4 class="mb-3">Nutrition Programs & Workshops</h4>
        <table id="programTable" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Focus Area</th>
              <th>Duration (weeks)</th>
              <th>Participants</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th><input type="text" placeholder="Search program" /></th>
              <th><input type="text" placeholder="Search focus" /></th>
              <th><input type="text" placeholder="Search duration" /></th>
              <th><input type="text" placeholder="Search participants" /></th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="(program, index) in programs" :key="index">
              <td>{{ program.name }}</td>
              <td>{{ program.focus }}</td>
              <td>{{ program.duration }}</td>
              <td>{{ program.participants }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import 'datatables.net-dt/css/dataTables.dataTables.css'
import $ from 'jquery'
import 'datatables.net-dt'

export default {
  data() {
    return {
      // Table 1: Public Health Campaigns data
      campaigns: [
        { name: 'Healthy Eating Week', region: 'Melbourne CBD', target: 'Adults', year: 2025 },
        { name: 'Fruit & Veg Challenge', region: 'Fitzroy', target: 'Teens', year: 2026 },
        { name: 'School Nutrition Program', region: 'Carlton', target: 'Children', year: 2025 },
        { name: 'Community Kitchen Project', region: 'Brunswick', target: 'Low-income Families', year: 2026 },
        { name: 'Nutrition Awareness Month', region: 'South Yarra', target: 'All Ages', year: 2025 },
        { name: 'Healthy Lifestyle Campaign', region: 'Docklands', target: 'Adults', year: 2026 },
        { name: 'Hydration Awareness Week', region: 'St Kilda', target: 'Teens', year: 2025 },
        { name: 'School Fruit Program', region: 'Richmond', target: 'Children', year: 2026 },
        { name: 'Community Garden Initiative', region: 'Flemington', target: 'Families', year: 2025 },
        { name: 'Sugar Reduction Campaign', region: 'Southbank', target: 'Adults', year: 2026 },
        { name: 'Healthy Snack Challenge', region: 'North Melbourne', target: 'Children', year: 2025 },
        { name: 'Nutrition Education Week', region: 'Carlton North', target: 'All Ages', year: 2026 },
        { name: 'Cooking for Health', region: 'Prahran', target: 'Adults', year: 2025 },
        { name: 'Teen Nutrition Program', region: 'Brunswick East', target: 'Teens', year: 2026 },
        { name: 'Heart Healthy Campaign', region: 'Toorak', target: 'Adults', year: 2025 },
        { name: 'Community Nutrition Fair', region: 'Footscray', target: 'Families', year: 2026 },
        { name: 'School Lunch Improvements', region: 'Thornbury', target: 'Children', year: 2025 },
        { name: 'Eat Smart Week', region: 'Essendon', target: 'Adults', year: 2026 },
        { name: 'Vitamins & Minerals Month', region: 'Malvern', target: 'All Ages', year: 2025 },
        { name: 'Healthy Home Cooking', region: 'Williamstown', target: 'Families', year: 2026 }
      ],

      // Table 2: Nutrition Programs data
      programs: [
        { name: 'Cooking Basics Workshop', focus: 'Meal Prep', duration: 4, participants: 25 },
        { name: 'School Lunch Reform', focus: 'Child Nutrition', duration: 8, participants: 200 },
        { name: 'Community Garden Training', focus: 'Plant-based Diets', duration: 6, participants: 30 },
        { name: 'Hydration & Health Seminar', focus: 'Water Intake', duration: 2, participants: 50 },
        { name: 'Sugar Awareness Class', focus: 'Reduce Sugar', duration: 3, participants: 40 },
        { name: 'Heart Healthy Cooking', focus: 'Cardiovascular Health', duration: 5, participants: 35 },
        { name: 'Teen Nutrition Workshop', focus: 'Teen Health', duration: 4, participants: 45 },
        { name: 'Vegan Basics Program', focus: 'Plant-based Diet', duration: 6, participants: 20 },
        { name: 'Family Meal Planning', focus: 'Healthy Families', duration: 5, participants: 60 },
        { name: 'Low Sodium Cooking', focus: 'Blood Pressure', duration: 4, participants: 25 },
        { name: 'Public Health Lecture', focus: 'Nutrition Awareness', duration: 2, participants: 100 },
        { name: 'Cooking for Seniors', focus: 'Aging & Nutrition', duration: 3, participants: 30 },
        { name: 'Diabetes Nutrition Program', focus: 'Blood Sugar', duration: 6, participants: 50 },
        { name: 'Food Label Reading', focus: 'Consumer Education', duration: 2, participants: 40 },
        { name: 'School Fruit Tasting', focus: 'Children Nutrition', duration: 1, participants: 150 },
        { name: 'Healthy Snack Workshop', focus: 'Teen Snacks', duration: 2, participants: 45 },
        { name: 'Vitamin Education Seminar', focus: 'Micronutrients', duration: 3, participants: 35 },
        { name: 'Community Cooking Event', focus: 'Family Nutrition', duration: 4, participants: 80 },
        { name: 'Weight Management Program', focus: 'Obesity Prevention', duration: 6, participants: 50 },
        { name: 'Meal Prep Challenge', focus: 'Healthy Habits', duration: 3, participants: 60 }
      ]
    };
  },
  mounted() {
    // Initialize tables after component mounts
    this.initTable('#campaignTable'); // Initialize campaigns table
    this.initTable('#programTable');  // Initialize programs table
  },
  methods: {
    // ==========================
    // Initialize DataTables with column search
    // ==========================
    initTable(selector) {
      const table = $(selector).DataTable({
        pageLength: 10,
        lengthChange: false,
        ordering: true,
        searching: true,
        language: { search: 'Global Search:' }
      });

      // Enable column-specific search inputs
      table.columns().every(function () {
        const column = this;
        $('input', this.footer()).on('keyup change clear', function () {
          if (column.search() !== this.value) {
            column.search(this.value).draw();
          }
        });
      });
    }
  }
};
</script>


<style scoped>
.about {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tables-section {
  margin-top: 50px;
}

.card { border-radius: 12px; padding: 15px; }

table.dataTable tfoot th { padding: 5px 8px; }
table.dataTable tfoot input {
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
