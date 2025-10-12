<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Create an Account</h1>

    <form @submit.prevent="register">


      <!-- Email -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="formData.email"
          @input="() => validateEmail(false)"
          @blur="() => validateEmail(true)"
          required
        />
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
      </div>



      <!-- Username -->
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.username"
          @input="() => validateName(false)"
          @blur="() => validateName(true)"
          required
        />
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </div>



      <!-- Password -->
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          v-model="formData.password"
          @input="() => validatePassword(false)"
          @blur="() => validatePassword(true)"
          required
        />
        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
      </div>



      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          v-model="formData.confirmPassword"
          @input="() => validateConfirmPassword(false)"
          @blur="() => validateConfirmPassword(true)"
          required
        />
        <div v-if="errors.confirmPassword" class="text-danger">
          {{ errors.confirmPassword }}
        </div>
      </div>




      <!-- Gender -->
      <div class="mb-3">
        <label class="form-label">Gender</label>
        <select
          class="form-select"
          v-model="formData.gender"
          @input="() => validateGender(false)"
          @blur="() => validateGender(true)"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
      </div>




      <!-- Reason -->
      <div class="mb-3">
        <label class="form-label">Reason for joining</label>
        <textarea
          class="form-control"
          rows="3"
          v-model="formData.reason"
          @input="() => validateReason(false)"
          @blur="() => validateReason(true)"
        ></textarea>
        <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
        <div v-if="messages.reason" class="text-success">{{ messages.reason }}</div>
      </div>




      <!-- Suburb -->
      <div class="mb-3">
        <label class="form-label">Suburb</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.suburb"
        />
      </div>




      <!-- Buttons -->
      <div class="text-center">
        <button type="submit" class="btn btn-primary me-2">Register</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">
          Clear
        </button>
      </div>
    </form>
  </div>
</template>




<script setup>
import { ref } from "vue"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "vue-router"
import { auth, db } from "../main.js"

const router = useRouter()

// 
const formData = ref({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  gender: "",
  reason: "",
  suburb: "",
  role: "user", // Default Role
})

// error message
const errors = ref({
  email: null,
  username: null,
  password: null,
  confirmPassword: null,
  gender: null,
  reason: null,
})

const messages = ref({
  reason: null,
})

// Validation function
const validateEmail = (blur) => {
  const email = formData.value.email.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    if (blur) errors.value.email = "Email is required"
  } else if (!emailRegex.test(email)) {
    if (blur) errors.value.email = "Invalid email format"
  } else {
    errors.value.email = null
  }
}

const validateName = (blur) => {
  if (formData.value.username.trim().length < 3) {
    if (blur) errors.value.username = "Username must be at least 3 characters"
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = "Must include an uppercase letter"
  } else if (!hasLowercase) {
    if (blur) errors.value.password = "Must include a lowercase letter"
  } else if (!hasNumber) {
    if (blur) errors.value.password = "Must include a number"
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = "Must include a special character"
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.confirmPassword !== formData.value.password) {
    if (blur) errors.value.confirmPassword = "Passwords do not match"
  } else {
    errors.value.confirmPassword = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = "Please select your gender"
  } else {
    errors.value.gender = null
  }
}

const validateReason = (blur) => {
  const text = formData.value.reason.trim()
  if (!text) {
    if (blur) errors.value.reason = "Reason is required"
    messages.value.reason = null
  } else {
    errors.value.reason = null
    if (/friend/i.test(text)) {
      messages.value.reason = "Great to have a friend!"
    } else {
      messages.value.reason = null
    }
  }
}

// Registration Function
const register = async () => {
  validateEmail(true)
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateGender(true)
  validateReason(true)

  const hasErrors = Object.values(errors.value).some((err) => err)
  if (hasErrors) {
    alert("Please fix the errors before submitting.")
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password
    )

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: formData.value.email,
      username: formData.value.username,
      gender: formData.value.gender,
      reason: formData.value.reason,
      suburb: formData.value.suburb,
      role: "user", // 默认存储为 user
    })

    alert("Registration successful! Please log in.")
    router.push("/FireLogin")
  } catch (error) {
    console.error("Firebase Registration Failed:", error.code, error.message)
    alert(`Error: ${error.message}`)
  }
}

// clear form
const clearForm = () => {
  formData.value = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
    reason: "",
    suburb: "",
    role: "user",
  }
  Object.keys(errors.value).forEach((key) => (errors.value[key] = null))
  Object.keys(messages.value).forEach((key) => (messages.value[key] = null))
}
</script>

<style scoped>
.container {
  max-width: 500px;
}
.text-danger {
  font-size: 0.9rem;
}
.text-success {
  font-size: 0.9rem;
  color: green;
}
</style>
