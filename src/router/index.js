import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import Form from '../components/Form.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import WeatherView from '../views/WeatherView.vue'
import GeoMapView from "@/views/GeoMapView.vue";
import AddBookView from "../views/AddBookView.vue"
import ManageBooksView from "../views/ManageBooksView.vue"
import CalendarView from "../views/CalendarView.vue"
import EmailView from '../views/EmailView.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
  path: "/fireRegister",
  name: "FireRegister",
  component: () => import("../views/FirebaseRegisterView.vue")
},
{
    path: "/addbook",
    name: "AddBook",
    component: AddBookView
  },

  {
  path: "/WeatherCheck",
  name: "WeatherCheck",
  component: WeatherView
},
{ path: 
  "/managebooks", 
  name: "ManageBooks", 
  component: ManageBooksView 
},
  {
    path: '/GeoMap',
    name: 'GeoMap',
    component: GeoMapView
  },
  { 
    path: '/calendar', 
    name: 'Calendar', 
    component: CalendarView 
  },
  
  {
  path: '/Email',
  name: 'Email',
  component: EmailView
}

  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router