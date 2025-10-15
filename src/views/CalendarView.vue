<template>
  <div class="container mt-4">
    <h2 class="mb-3">📅 My Calendar</h2>

    <!-- Login status -->
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
          <!-- Step = 3600 seconds -> only allows full hour -->
          <input
            type="datetime-local"
            v-model="appointment.start"
            class="form-control"
            required
            step="3600"
            :min="minDateTime"
          />
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
      user: null,
      appointment: { name: '', phone: '', start: '', notes: '' },
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        select: this.handleSelect,
        events: []
      },
      bookedHours: [] // store booked times in ISO strings rounded to hour
    }
  },
  computed: {
    // Minimum selectable date = now
    minDateTime() {
      const now = new Date()
      now.setMinutes(0, 0, 0)
      return now.toISOString().slice(0, 16)
    }
  },
  mounted() {
    this.loadEvents()
    onAuthStateChanged(auth, (user) => {
      this.user = user
    })
  },
  methods: {
    async login() {
      try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
      } catch (error) {
        alert('Login failed: ' + error.message)
      }
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
    // Calendar click selection
    async handleSelect(info) {
      if (!this.user) {
        alert('❌ Please login first to create an event!')
        return
      }

      let selectedHour = new Date(info.start)
      selectedHour.setMinutes(0, 0, 0)
      const isoHour = selectedHour.toISOString()

      if (this.bookedHours.includes(isoHour)) {
        alert('❌ This hour is already booked. Please select another time.')
        return
      }

      const title = prompt('Enter event title')
      if (!title) return

      const notes = prompt('Enter notes (optional)') || ''
      const remindAt = new Date(selectedHour.getTime() - 15 * 60000)

      const newEvent = {
        title,
        start: selectedHour.toISOString(),
        remindAt: remindAt.toISOString(),
        createdBy: this.user.uid,
        email: this.user.email,
        notes
      }

      await addDoc(collection(db, 'events'), newEvent)
      info.view.calendar.addEvent(newEvent)
      this.bookedHours.push(isoHour)
      this.scheduleReminder(newEvent)
    },
    async submitAppointment() {
      if (!this.user) {
        alert('❌ Please login first to book an appointment!')
        return
      }

      const phoneRegex = /^\d{9}$/
      if (!this.appointment.name || !this.appointment.phone || !this.appointment.start) {
        alert('Please fill in all required fields')
        return
      }

      if (!phoneRegex.test(this.appointment.phone)) {
        alert('❌ Phone number must be exactly 9 digits')
        return
      }

      // Round to full hour
      const startHour = new Date(this.appointment.start)
      startHour.setMinutes(0, 0, 0)
      const isoHour = startHour.toISOString()

      if (this.bookedHours.includes(isoHour)) {
        alert('❌ This hour is already booked. Please select another time.')
        return
      }

      // Check user's max 2 appointments
      const q = query(collection(db, 'events'), where('email', '==', this.user.email))
      const snapshot = await getDocs(q)
      if (snapshot.size >= 2) {
        alert('❌ You have already booked 2 appointments. Cannot book more.')
        return
      }

      const newEvent = {
        title: `${this.appointment.name} Appointment`,
        start: startHour.toISOString(),
        remindAt: new Date(startHour.getTime() - 15 * 60000).toISOString(),
        createdBy: this.user.uid,
        email: this.user.email,
        notes: this.appointment.notes,
        phone: this.appointment.phone
      }

      await addDoc(collection(db, 'events'), newEvent)
      this.calendarOptions.events.push(newEvent)
      this.bookedHours.push(isoHour)
      this.scheduleReminder(newEvent)

      this.appointment = { name: '', phone: '', start: '', notes: '' }
      alert('Appointment booked successfully!')
    },
    async loadEvents() {
      const querySnapshot = await getDocs(collection(db, 'events'))
      const events = []

      querySnapshot.forEach(doc => {
        const event = doc.data()
        events.push(event)
        this.scheduleReminder(event)

        // Record booked hours
        const d = new Date(event.start)
        d.setMinutes(0, 0, 0)
        this.bookedHours.push(d.toISOString())
      })

      this.calendarOptions.events = events
    },
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
