<template>
  <div id="weather-view">
    <!-- Input field bound to 'city' -->
    <input type="text" v-model="city" placeholder="Enter city name" />
    <button @click="searchByCity">Search</button>

    <!-- Main section displays weather info if available -->
    <main v-if="weatherData">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <div>
        <img :src="iconUrl" alt="Weather Icon" />
        <p>{{ temperature }} °C</p>
      </div>
      <span>{{ weatherData.weather[0].description }}</span>

      <!-- New: Ask AI for advice -->
      <div class="ai-section">
        <button @click="getAIAdvice" :disabled="aiLoading">
          {{ aiLoading ? "Thinking..." : "Ask AI for advice" }}
        </button>

        <!-- Display AI response -->
        <p v-if="aiResponse" class="ai-response">
          💬 {{ aiResponse }}
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual OpenWeatherMap API key
const weatherKey = "150f5ba1c96de72a4d65991261ba26c0";

// Replace with your Gemini API key
const geminiKey = "AIzaSyAR4x79BHm2rgNgmEjESa7ww8BlmzTcXRI";

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      aiResponse: "",
      aiLoading: false,
    };
  },
  computed: {
    temperature() {
      return this.weatherData
        ? Math.floor(this.weatherData.main.temp - 273.15)
        : null;
    },
    iconUrl() {
      return this.weatherData
        ? `http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },
  methods: {
    async fetchCurrentLocationWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}`;
          await this.fetchWeatherData(url);
        });
      }
    },
    async searchByCity() {
      if (!this.city) return;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${weatherKey}`;
      await this.fetchWeatherData(url);
    },
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
        this.aiResponse = ""; // reset AI advice
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.weatherData = null;
      }
    },

    // ✅ New method: Generate AI advice
    async getAIAdvice() {
  if (!this.weatherData) return;

  this.aiLoading = true;
  this.aiResponse = "";

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);

    // ✅ 使用官方最新稳定模型（替换掉 gemini-pro）
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are a friendly weather assistant. The weather in ${this.weatherData.name}, ${this.weatherData.sys.country} is ${this.weatherData.weather[0].description} with temperature ${this.temperature}°C. Write a short cheerful message for the user.`;

    // ✅ 按最新 SDK 格式调用
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // ✅ 获取文本结果
    this.aiResponse = result.response.text();
  } catch (err) {
    console.error("AI error:", err);
    // 🔧 提供更友好的提示
    this.aiResponse = "Sorry, I couldn’t generate advice right now. Please try again later.";
  } finally {
    this.aiLoading = false;
  }
}

  },
  mounted() {
    this.fetchCurrentLocationWeather();
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

.ai-section {
  margin-top: 20px;
}

.ai-response {
  margin-top: 10px;
  font-style: italic;
  color: #444;
}
</style>
