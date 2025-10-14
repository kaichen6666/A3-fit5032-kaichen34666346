//import './assets/main.css'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Firestore

// Vue 
const vueApp = createApp(App)
vueApp.use(PrimeVue, { theme: { preset: Aura } })
vueApp.use(router)
vueApp.mount('#app')

// Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyAbtqUOMI0GmgkigvFQgKjWJEFDfPlsADU",
  authDomain: "week7-kaichen.firebaseapp.com",
  projectId: "week7-kaichen",
  storageBucket: "week7-kaichen.firebasestorage.app",
  messagingSenderId: "950495156188",
  appId: "1:950495156188:web:3fa8fac383a9710dc56119"
};


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);   // Firebase Auth
const db = getFirestore(firebaseApp); // Firestore

export { auth, db };  
