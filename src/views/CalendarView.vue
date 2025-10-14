<template>
  <div class="container mt-4">
    <h2 class="mb-3">📅 My Calendar</h2>

    <!-- Login status -->
    <!-- Only login can book -->
    <!-- Only two appointments -->
    <!-- BR (F.1): Innovation1-Appointment Booking (using Calendar) -->
    <div class="mb-3">
      <template v-if="user">
        <p>Logged in as: <strong>{{ user.email }}</strong></p>
        <button class="btn btn-secondary btn-sm" @click="logout">Logout</button>
      </template>
      <template v-else>
        <p>Please login to book an appointment.</p>
        <button class="btn btn-primary btn-sm" @click="login">Login</button>
      </template>
    </div>

    <!-- User Appointment Form -->
    <div class="card mb-4 p-3">
      <h4>📌 Book an Appointment</h4>
      <form @submit.prevent="submitAppointment">
        <div class="mb-2">
          <input type="text" v-model="appointment.name" class="form-control" placeholder="Name" required />
        </div>
        <div class="mb-2">
          <input type="tel" v-model="appointment.phone" class="form-control" placeholder="Phone" required />
        </div>
        <div class="mb-2">
          <input type="datetime-local" v-model="appointment.start" class="form-control" required />
        </div>
        <div class="mb-2">
          <textarea v-model="appointment.notes" class="form-control" placeholder="Notes"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Book</button>
      </form>
    </div>

    <!-- Calendar -->
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { db, auth } from '../main'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'

export default {
  components: { FullCalendar },
  data() {
    return {
      user: null,  // Logged-in user
      appointment: { name: '', phone: '', start: '', notes: '' },
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        select: this.handleSelect,
        events: []
      }
    }
  },
  mounted() {
    this.loadEvents()

    // Listen to login status
    onAuthStateChanged(auth, (user) => {
      this.user = user
    })
  },
  methods: {
    // Login with Google
    async login() {
      try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
      } catch (error) {
        alert('Login failed: ' + error.message)
      }
    },

    // Logout
    async logout() {
      await signOut(auth)
      this.user = null
    },

    // Calendar selection
    async handleSelect(info) {
      if (!this.user) {
        alert('❌ Please login first to create an event!')
        return
      }

      const title = prompt('Enter event title')
      if (!title) return

      const notes = prompt('Enter notes (optional)') || ''
      const remindMinutesBefore = 15
      const startTime = new Date(info.startStr)
      const remindAt = new Date(startTime.getTime() - remindMinutesBefore * 60000)

      const newEvent = {
        title,
        start: info.startStr,
        remindAt: remindAt.toISOString(),
        //userid in firebase
        createdBy: this.user.uid,
        email: this.user.email,
        notes
      }

      await addDoc(collection(db, 'events'), newEvent)
      info.view.calendar.addEvent(newEvent)
      this.scheduleReminder(newEvent)
    },



    // Submit appointment
    async submitAppointment() {
      if (!this.user) {
        alert('❌ Please login first to book an appointment!')
        return
      }

      // 9
      const phoneRegex = /^\d{9}$/  
      if (!this.appointment.name || !this.appointment.phone || !this.appointment.start) {
      alert('Please fill in all required fields')
      return
      }

      if (!phoneRegex.test(this.appointment.phone)) {
        alert('❌ Phone number must be exactly 9 digits')
        return
      }

      if (!this.appointment.name || !this.appointment.phone || !this.appointment.start) {
        alert('Please fill in all required fields')
        return
      }

      // Check how many appointments this user already has
      const q = query(collection(db, 'events'), where('email', '==', this.user.email))
      const snapshot = await getDocs(q)
      if (snapshot.size >= 2) {
        alert('❌ You have already booked 2 appointments. Cannot book more.')
        return
      }

      const remindMinutesBefore = 15
      const startTime = new Date(this.appointment.start)
      const remindAt = new Date(startTime.getTime() - remindMinutesBefore * 60000)

      const newEvent = {
        title: `${this.appointment.name} Appointment`,
        start: this.appointment.start,
        remindAt: remindAt.toISOString(),
        createdBy: this.user.uid,
        email: this.user.email,
        notes: this.appointment.notes,
        phone: this.appointment.phone
      }

      // Save to Firebase
      await addDoc(collection(db, 'events'), newEvent)

      // Add to calendar
      this.calendarOptions.events.push(newEvent)

      // Schedule reminder
      this.scheduleReminder(newEvent)

      // Clear form
      this.appointment = { name: '', phone: '', start: '', notes: '' }
      alert('Appointment booked successfully!')
    },

    // Load existing events
    async loadEvents() {
      const querySnapshot = await getDocs(collection(db, 'events'))
      const events = []

      querySnapshot.forEach(doc => {
        const event = doc.data()
        events.push(event)
        this.scheduleReminder(event)
      })

      this.calendarOptions.events = events
    },

    // Schedule reminders
    scheduleReminder(event) {
      const now = new Date()
      const remindTime = new Date(event.remindAt)
      const diff = remindTime - now

      if (diff > 0) {
        setTimeout(() => {
          alert(`🔔 Reminder: ${event.title}`)
        }, diff)
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
