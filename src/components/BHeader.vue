<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home 
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About
          </router-link>
        </li>

        <!-- New Navigation Link for Firebase Authentication -->
        <li class="nav-item">
          <router-link to="/Firelogin" class="nav-link" active-class="active">
            Login
          </router-link>
        </li>

        <li class="nav-item">
          <router-link  to="/fireRegister" class="nav-link"  active-class="active">
            Register
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">
            Add Book
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/managebooks" class="nav-link" active-class="active">
            Manage Books
          </router-link>
        </li>


        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active" >
            Get Weather
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/calendar" class="nav-link" active-class="active">
            Appointments
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/GeoMap" class="nav-link" active-class="active">
            Map
          </router-link>
        </li>

        <li class="nav-item">
  <router-link to="/Email" class="nav-link" active-class="active">
    Email
  </router-link>
</li>

      </ul>
    </header>
  </div>
</template>
