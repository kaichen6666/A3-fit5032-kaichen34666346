<template>
  <div class="container mt-5">
    <h1 class="mb-4">Login</h1>

    
    <!-- Google Sign-In button -->
    <div class="text-center mb-3" v-if="!currentUser">
      <button class="btn btn-danger" @click="googleLogin">
        <i class="bi bi-google me-2"></i> Sign in with Google
      </button>
    </div>

    <hr />

    <!-- Email/Password login form (only shown when user is not signed in) -->
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

    <!-- Show current user info if logged in -->
    <div v-else class="mt-3 text-center">
      <p>Current User: {{ currentUser.email }}</p>
      <p>User Role: {{ currentUserRole }}</p>
      <button class="btn btn-warning" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "../main.js"

// -------------------------
// Reactive variables
// -------------------------
const email = ref("")               // User email input
const password = ref("")            // User password input
const currentUser = ref(null)       // Currently signed-in user
const currentUserRole = ref("")     // Role of the signed-in user
const errorMessage = ref("")        // Error message for login failure

// -------------------------
// Monitor authentication state
// -------------------------
onAuthStateChanged(auth, async (user) => {
  currentUser.value = user
  if (user) {
    // Fetch user role from Firestore (or set default role)
    const docSnap = await getDoc(doc(db, "users", user.uid))
    if (docSnap.exists()) {
      currentUserRole.value = docSnap.data().role
      console.log("Logged in user role:", currentUserRole.value)
    } else {
      // If new user logs in via Google, set default role
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user"
      })
      currentUserRole.value = "user"
      console.log("New Google user added to Firestore")
    }
    console.log("Current signed-in user:", user.email)
  } else {
    currentUserRole.value = ""
    console.log("No user is signed in")
  }
})

// -------------------------
// Email/Password Login
// -------------------------
const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
    console.log("Firebase Login Successful!", userCredential)
    alert(`Welcome back, ${userCredential.user.email}! Role: ${currentUserRole.value}`)
    email.value = ""
    password.value = ""
  } catch (error) {
    console.error("Firebase Login Failed:", error.code, error.message)
    alert(`Error: ${error.message}`)
  }
}

// -------------------------
// Google Login (External Authentication)
// -------------------------
const googleLogin = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Check if user exists in Firestore, otherwise create new record
    const userDoc = doc(db, "users", user.uid)
    const docSnap = await getDoc(userDoc)
    if (!docSnap.exists()) {
      await setDoc(userDoc, {
        email: user.email,
        role: "user" // Default role for new Google users
      })
    }

    alert(`Welcome, ${user.displayName || user.email}!`)
    console.log("Google Sign-In Successful:", user.email)
  } catch (error) {
    console.error("Google Sign-In Failed:", error)
    alert(`Google login failed: ${error.message}`)
  }
}

// -------------------------
// Logout current user
// -------------------------
const logout = () => {
  auth.signOut().then(() => {
    currentUser.value = null
    currentUserRole.value = ""
    alert("Logged out successfully!")
  })
}

// -------------------------
// Clear email/password fields
// -------------------------
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
