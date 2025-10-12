<template>
  <div class="container mt-5">
    <h1 class="mb-4">Manage Books</h1>

    <div v-if="books.length">
      <div
        v-for="book in books"
        :key="book.id"
        class="card mb-3"
      >
        <div class="card-body">
          <h5 class="card-title">{{ book.name }}</h5>
          <p class="card-text">ISBN: {{ book.isbn }}</p>

          <input type="text" v-model="book.name" placeholder="Update Name" class="form-control mb-2"/>
          <input type="number" v-model.number="book.isbn" placeholder="Update ISBN" class="form-control mb-2"/>

          <button class="btn btn-success me-2" @click="updateBook(book)">Update</button>
          <button class="btn btn-danger" @click="deleteBook(book.id)">Delete</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No books found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../main.js"

const books = ref([])

const fetchBooks = async () => {
  const querySnapshot = await getDocs(collection(db, "books"))
  books.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(() => fetchBooks())

const updateBook = async (book) => {
  const bookRef = doc(db, "books", book.id)
  await updateDoc(bookRef, {
    name: book.name,
    isbn: Number(book.isbn)
  })
  alert("Book updated successfully")
  fetchBooks()
}

const deleteBook = async (id) => {
  const bookRef = doc(db, "books", id)
  await deleteDoc(bookRef)
  alert("Book deleted successfully")
  fetchBooks()
}
</script>

<style scoped>
.card {
  max-width: 500px;
}
</style>
