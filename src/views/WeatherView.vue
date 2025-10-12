<template>
  <div id="weather-view">
    <!-- Input field bound to 'city' -->
    <input type="text" v-model="city" placeholder="Enter city name" />
    <!-- Button triggers searchByCity method -->
    <button @click="searchByCity">Search</button>

    <!-- Main section displays weather info if available -->
    <main v-if="weatherData">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <div>
        <!-- Weather icon from API -->
        <img :src="iconUrl" alt="Weather Icon" />
        <!-- Temperature in Celsius -->
        <p>{{ temperature }} °C</p>
      </div>
      <!-- Weather description -->
      <span>{{ weatherData.weather[0].description }}</span>
    </main>
  </div>
</template>

<script>
import axios from "axios";

// Replace with your actual OpenWeatherMap API key
const apikey = "150f5ba1c96de72a4d65991261ba26c0";

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",           // User input city name
      weatherData: null,  // Current weather data
    };
  },
  computed: {
    // Convert temperature from Kelvin to Celsius
    temperature() {
      return this.weatherData
        ? Math.floor(this.weatherData.main.temp - 273.15)
        : null;
    },
    // Generate weather icon URL
    iconUrl() {
      return this.weatherData
        ? `http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },
  mounted() {
    // Fetch weather for user's current location on load
    this.fetchCurrentLocationWeather();
  },
  methods: {
    // Fetch weather by user's geolocation
    async fetchCurrentLocationWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
          await this.fetchWeatherData(url);
        });
      }
    },
    // Fetch weather by city name
    async searchByCity() {
      if (!this.city) return;
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`;
      await this.fetchWeatherData(url);
    },
    // General method to fetch weather data from API
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.weatherData = null;
      }
    },
  },
};
</script>

<style scoped>
#weather-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 20px;
}

input {
  padding: 8px;
  margin-bottom: 10px;
  width: 200px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

main {
  margin-top: 20px;
}
</style>
