<template>
  <div class="container mt-5">
    <h1 class="mb-4">Login</h1>

    <form v-if="!currentUser" @submit.prevent="login">
      <div class="mb-3">
        <input
          type="email"
          class="form-control"
          placeholder="Email"
          v-model="email"
          required
        />
      </div>

      <div class="mb-3">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          v-model="password"
          required
        />
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary me-2">Login</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">
          Clear
        </button>
      </div>
    </form>

    <div v-else class="mt-3">
      <p>Current User: {{ currentUser.email }}</p>
      <p>User Role: {{ currentUserRole }}</p>
      <button class="btn btn-warning" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../main.js"

const email = ref("")
const password = ref("")
const currentUser = ref(null)
const currentUserRole = ref("")
const errorMessage = ref("")

// Track current signed-in user
onAuthStateChanged(auth, async (user) => {
  currentUser.value = user
  if (user) {
    // Get role from Firestore
    const docSnap = await getDoc(doc(db, "users", user.uid))
    if (docSnap.exists()) {
      currentUserRole.value = docSnap.data().role
      console.log("Logged in user role:", currentUserRole.value)
    }
    console.log("Current signed-in user:", user.email)
  } else {
    currentUserRole.value = ""
    console.log("No user is signed in")
  }
})

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    // Role is fetched automatically by onAuthStateChanged
    console.log("Firebase Login Successful!", userCredential)
    alert(`Welcome back, ${userCredential.user.email}! Role: ${currentUserRole.value}`)
    email.value = ""
    password.value = ""
  } catch (error) {
    console.error("Firebase Login Failed:", error.code, error.message)
    alert(`Error: ${error.message}`)
  }
}

const logout = () => {
  auth.signOut().then(() => {
    currentUser.value = null
    currentUserRole.value = ""
    alert("Logged out successfully!")
  })
}

const clearForm = () => {
  email.value = ""
  password.value = ""
}
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
