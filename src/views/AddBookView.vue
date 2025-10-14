<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Add New Book</h1>

    <form @submit.prevent="addBook">
      <!-- ISBN -->
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN</label>
        <input
          type="number"
          class="form-control"
          id="isbn"
          v-model.number="isbn"
          required
        />
      </div>

      <!-- Book Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Book Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="name"
          required
        />
      </div>

      <!-- 来源 -->
      <div class="mb-3">
        <label for="source" class="form-label">Book Source</label>
        <select id="source" class="form-select" v-model="source" required>
          <option disabled value="">-- Please select --</option>
          <option value="Donated">Donated</option>
          <option value="Institution Purchase">Institution Purchase</option>
          <option value="Library Borrow">Library Borrow</option>
        </select>
      </div>

      <!-- 类型 -->
      <div class="mb-3">
        <label for="type" class="form-label">Book Type</label>
        <select id="type" class="form-select" v-model="type" required>
          <option disabled value="">-- Please select --</option>
          <option value="Textbook">Textbook</option>
          <option value="Research Report">Research Report</option>
          <option value="Guidebook">Guidebook</option>
          <option value="Story Book">Story Book</option>
        </select>
      </div>

      <!-- 适龄人群 -->
      <div class="mb-3">
        <label for="ageGroup" class="form-label">Suitable Age Group</label>
        <select id="ageGroup" class="form-select" v-model="ageGroup" required>
          <option disabled value="">-- Please select --</option>
          <option value="Children (6-12)">Children (6-12)</option>
          <option value="Teenagers (13-18)">Teenagers (13-18)</option>
          <option value="Adults (19-60)">Adults (19-60)</option>
          <option value="Seniors (60+)">Seniors (60+)</option>
        </select>
      </div>

      <!-- 提交与清空 -->
      <div class="text-center mt-4">
        <button type="submit" class="btn btn-primary me-2">Add Book</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">
          Clear
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../main.js"

// 所有字段
const isbn = ref(null)
const name = ref("")
const source = ref("")
const type = ref("")
const ageGroup = ref("")

const addBook = async () => {
  if (!isbn.value || !name.value || !source.value || !type.value || !ageGroup.value) {
    alert("Please fill in all fields!")
    return
  }

  try {
    await addDoc(collection(db, "books"), {
      isbn: Number(isbn.value),
      name: name.value,
      source: source.value,
      type: type.value,
      ageGroup: ageGroup.value,
      createdAt: new Date()
    })
    alert(`Book "${name.value}" added successfully!`)
    clearForm()
  } catch (error) {
    console.error("Error adding book:", error)
    alert(`Error: ${error.message}`)
  }
}

const clearForm = () => {
  isbn.value = null
  name.value = ""
  source.value = ""
  type.value = ""
  ageGroup.value = ""
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
.form-label {
  font-weight: 600;
}
</style>
