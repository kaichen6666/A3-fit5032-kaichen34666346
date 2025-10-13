<template>
  <div class="about">
    <h1>About Our Library</h1>
    <p>
      Welcome to our digital library! We're dedicated to providing a vast collection of books
      and resources to our community.
    </p>

    <!-- ==========================
         Contact Email Form
    =========================== -->
    <h2>📧 Contact Us via Email</h2>
    <form @submit.prevent="sendEmail" class="email-form">
      <input
        v-model="email"
        type="email"
        placeholder="Recipient Email"
        required
      />
      <textarea
        v-model="message"
        placeholder="Write your message..."
        required
      ></textarea>
      <button type="submit" :disabled="sending">
        {{ sending ? "Sending..." : "Send Email" }}
      </button>
    </form>

    <!-- ==========================
         Interactive Tables Section
    =========================== -->
    <section class="tables-section">
      <h2 class="mt-5">📊 Interactive Data Tables</h2>

      <!-- 用户信息表 -->
      <div class="card mb-5 p-3 shadow-sm">
        <h4 class="mb-3">User Information</h4>
        <table id="userTable" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th><input type="text" placeholder="Search name" /></th>
              <th><input type="text" placeholder="Search email" /></th>
              <th><input type="text" placeholder="Search age" /></th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.age }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 产品信息表 -->
      <div class="card p-3 shadow-sm">
        <h4 class="mb-3">Product List</h4>
        <table id="productTable" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price ($)</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th><input type="text" placeholder="Search product" /></th>
              <th><input type="text" placeholder="Search category" /></th>
              <th><input type="text" placeholder="Search price" /></th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="(item, index) in products" :key="index">
              <td>{{ item.product }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.price }}</td>
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
      email: "",
      message: "",
      sending: false,
      authorizedEmails: [
        "wangjun6666666633@gmail.com",
        "kche0224@student.monash.edu"
      ],
      // 模拟用户数据
      users: [
        { name: 'Alice Johnson', email: 'alice@example.com', age: 25 },
        { name: 'Bob Smith', email: 'bob@example.com', age: 30 },
        { name: 'Carol Lee', email: 'carol@example.com', age: 28 },
        { name: 'Daniel Wong', email: 'daniel@example.com', age: 35 },
        { name: 'Emily Davis', email: 'emily@example.com', age: 22 },
        { name: 'Frank Zhang', email: 'frank@example.com', age: 27 },
        { name: 'Grace Tan', email: 'grace@example.com', age: 24 },
        { name: 'Henry Liu', email: 'henry@example.com', age: 33 },
        { name: 'Irene Chen', email: 'irene@example.com', age: 29 },
        { name: 'Jack Lee', email: 'jack@example.com', age: 31 },
        { name: 'Kelly Lin', email: 'kelly@example.com', age: 26 }
      ],
      // 模拟产品数据
      products: [
        { product: 'Camera A200', category: 'Electronics', price: 350 },
        { product: 'Running Shoes', category: 'Sportswear', price: 120 },
        { product: 'Smart Watch', category: 'Electronics', price: 199 },
        { product: 'Coffee Beans', category: 'Groceries', price: 25 },
        { product: 'Bluetooth Speaker', category: 'Electronics', price: 89 },
        { product: 'Desk Lamp', category: 'Home', price: 49 },
        { product: 'Office Chair', category: 'Furniture', price: 240 },
        { product: 'Yoga Mat', category: 'Sportswear', price: 35 },
        { product: 'Water Bottle', category: 'Accessories', price: 15 },
        { product: 'Notebook', category: 'Stationery', price: 6 },
        { product: 'Backpack', category: 'Accessories', price: 55 }
      ]
    };
  },
  mounted() {
    // 初始化表格
    this.initTable('#userTable');
    this.initTable('#productTable');
  },
  methods: {
    async sendEmail() {
      if (!this.email || !this.message) return;

      if (!this.authorizedEmails.includes(this.email)) {
        alert(`⚠️ The email "${this.email}" is not authorized in the Mailgun Sandbox.`);
        return;
      }

      this.sending = true;
      try {
        const response = await fetch("http://127.0.0.1:5001/week7-kaichen/us-central1/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            message: this.message,
          }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          alert("✅ Email sent successfully!");
          this.email = "";
          this.message = "";
        } else {
          alert(`❌ Failed to send email: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error sending email:", error);
        alert(`⚠️ An error occurred: ${error.message}`);
      } finally {
        this.sending = false;
      }
    },

    // 初始化 DataTables + 列搜索功能
    initTable(selector) {
      const table = $(selector).DataTable({
        pageLength: 10,
        lengthChange: false,
        ordering: true,
        searching: true,
        language: {
          search: 'Global Search:'
        }
      });

      // 为每列单独搜索
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
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 30px;
}

input,
textarea {
  padding: 12px;
  font-size: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
input:focus,
textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  outline: none;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

button {
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  font-weight: 600;
  transition: all 0.2s ease;
}
button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

/* 表格样式 */
.tables-section {
  margin-top: 60px;
}

.card {
  border-radius: 12px;
}

table.dataTable tfoot th {
  padding: 5px 8px;
}

table.dataTable tfoot input {
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
