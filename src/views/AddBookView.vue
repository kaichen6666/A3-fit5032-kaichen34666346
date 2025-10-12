<template>
  <div class="container mt-5">
    <h1 class="mb-4">Add New Book</h1>

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

      <div class="text-center">
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
import { db } from "../main.js" // main.js  Firestore

const isbn = ref(null)
const name = ref("")

const addBook = async () => {
  if (!isbn.value || !name.value) {
    alert("Both fields are required!")
    return
  }

  try {
    //  "books"
    await addDoc(collection(db, "books"), {
      isbn: Number(isbn.value),
      name: name.value
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
}
</script>

<style scoped>
.container {
  max-width: 500px;
}
</style>
