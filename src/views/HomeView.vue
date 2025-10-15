<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Skip link for keyboard users -->
    <a href="#main-content" class="sr-only focus:not-sr-only px-4 py-2 bg-green-500 text-white rounded z-50 fixed top-4 left-4">
      Skip to main content
    </a>

    <!-- Hero Section -->
    <section id="hero" class="text-center py-16 px-6 bg-green-50">
      <h1 class="text-4xl md:text-5xl font-bold text-green-700 mb-4">
        Public Health through Nutrition Education
      </h1>
      <p class="text-gray-700 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
        Promoting healthier lives through education, awareness, and community engagement.
      </p>
      <img 
        src="@/assets/heroner.webp" 
        alt="Healthy nutrition — promoting balanced diet awareness" 
        class="mx-auto rounded-2xl shadow-xl w-full max-w-3xl"
        role="img"
        aria-label="Image of healthy nutrition promoting balanced diet awareness"
      />
    </section>

    <!-- Main content wrapper for skip link -->
    <main id="main-content" class="flex-1">

      <!-- Nutrition Education Section -->
      <section id="education" class="py-16 px-6">
        <div class="max-w-5xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-green-700 mb-6">Nutrition Education</h2>
          <ul class="grid md:grid-cols-3 gap-6 text-left">
            <li class="bg-white rounded-2xl p-6 shadow-md focus:outline-none focus:ring-4 focus:ring-green-400">
              <h3 class="font-semibold text-green-700 mb-2">Balanced Diet</h3>
              <p class="text-gray-600">Understand the importance of a balanced diet for all age groups.</p>
            </li>
            <li class="bg-white rounded-2xl p-6 shadow-md focus:outline-none focus:ring-4 focus:ring-green-400">
              <h3 class="font-semibold text-green-700 mb-2">Healthy Habits</h3>
              <p class="text-gray-600">Learn small, practical changes for a healthier lifestyle.</p>
            </li>
            <li class="bg-white rounded-2xl p-6 shadow-md focus:outline-none focus:ring-4 focus:ring-green-400">
              <h3 class="font-semibold text-green-700 mb-2">Community Programs</h3>
              <p class="text-gray-600">Participate in local initiatives to promote public health nutrition.</p>
            </li>
          </ul>
        </div>
      </section>

      <!-- Programs Section -->
      <section id="programs" class="py-16 px-6 bg-green-50">
        <div class="max-w-5xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-green-700 mb-6">Our Programs</h2>
          <ul class="grid md:grid-cols-3 gap-6 text-left">
            <li class="bg-white rounded-2xl p-6 shadow-md focus:outline-none focus:ring-4 focus:ring-green-400">
              <img
                src="@/assets/2.webp"
                alt="Application interface showing a data visualization program"
                class="rounded-xl mb-3 shadow-lg"
                role="img"
                aria-label="Application interface showing a data visualization program"
              />
              <h3 class="font-semibold text-green-700 mb-2">School Workshops</h3>
              <p class="text-gray-600">Interactive sessions teaching kids about healthy eating.</p>
            </li>
            <li class="bg-white rounded-2xl p-6 shadow-md focus:outline-none focus:ring-4 focus:ring-green-400">
              <img
                src="@/assets/3.webp"
                alt="User registration interface demonstrating account creation"
                class="rounded-xl mb-3 shadow-lg"
                role="img"
                aria-label="User registration interface demonstrating account creation"
              />
              <h3 class="font-semibold text-green-700 mb-2">Community Cooking</h3>
              <p class="text-gray-600">Hands-on cooking classes for families to learn nutritious recipes.</p>
            </li>
            <li class="bg-white rounded-2xl p-6 shadow-md focus:outline-none focus:ring-4 focus:ring-green-400">
              <img
                src="@/assets/4.webp"
                alt="Interactive map interface displaying user location and nearby points of interest"
                class="rounded-xl mb-3 shadow-lg"
                role="img"
                aria-label="Interactive map interface displaying user location and nearby points of interest"
              />
              <h3 class="font-semibold text-green-700 mb-2">Online Courses</h3>
              <p class="text-gray-600">Virtual lessons on nutrition, meal planning, and lifestyle tips.</p>
            </li>
          </ul>
        </div>
      </section>

      <!-- Health Quiz Section -->
      <section
        id="quiz"
        class="py-16 px-6 bg-white text-center"
        aria-labelledby="quiz-title"
        role="region"
      >
        <h2 id="quiz-title" class="text-3xl font-bold text-green-700 mb-4">
          Are You Eating Healthy?
        </h2>
        <p class="text-gray-600 mb-6">
          Answer a quick question to find out!
        </p>

        <!-- Quiz question -->
        <div v-if="!quizAnswered">
          <p class="text-lg mb-4" id="quiz-question">
            How many servings of vegetables do you eat daily?
          </p>
          <div class="flex justify-center gap-4" role="radiogroup" aria-labelledby="quiz-question">
            <button
              v-for="(option, index) in quizOptions"
              :key="index"
              @click="handleQuizAnswer(index)"
              :aria-checked="selectedAnswer === index ? 'true' : 'false'"
              :class="getQuizButtonClass(index) + ' focus:outline-none focus:ring-4 focus:ring-green-400'"
              role="radio"
              tabindex="0"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Quiz result -->
        <div v-else class="mt-6" role="status" aria-live="polite">
          <p class="text-lg font-semibold text-green-700">{{ quizResult }}</p>
          <button
            @click="resetQuiz"
            class="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700
                   focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </section>

      <!-- Health Tips Section -->
      <section class="py-12 bg-green-100 text-center">
        <h2 class="text-2xl font-bold text-green-700 mb-4">🌿 Today's Health Tips</h2>
        <ul>
          <li v-for="tip in randomTips" :key="tip" class="text-gray-700 mb-2">
            {{ tip }}
          </li>
        </ul>
      </section>

    </main>

    <!-- Footer -->
    <footer class="text-center py-6 text-gray-500 text-sm border-t border-gray-100 mt-auto">
      © 2025 Public Health Nutrition Initiative
    </footer>

  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      form: { name: "", email: "", message: "" },
      quizAnswered: false,
      quizResult: "",
      selectedAnswer: null,
      quizOptions: ["0–1", "2–3", "4+"],
      allTips: [
        "Drink at least 8 glasses of water daily 💧",
        "Add more greens to your meals 🥬",
        "Avoid sugary drinks and snacks 🍭",
        "Take a 10-minute walk after meals 🚶‍♀️",
        "Sleep at least 7 hours a night 😴",
      ],
      randomTips: [],
    };
  },
  mounted() {
    // Randomly select 3 health tips on page load
    this.randomTips = this.allTips.sort(() => 0.5 - Math.random()).slice(0, 3);
  },
  methods: {
    // Handle form submission
    handleSubmit() {
      alert(`✅ Thank you, ${this.form.name}! Your message has been sent.`);
      console.log("Form submitted:", this.form);
      this.form = { name: "", email: "", message: "" };
    },

    // Handle quiz answer selection
    handleQuizAnswer(answer) {
      this.selectedAnswer = answer;
      this.quizAnswered = true;

      if (answer === 0)
        this.quizResult = "Try to include more vegetables in your diet 🌿";
      else if (answer === 1)
        this.quizResult = "Good! You're on the right track 🥦";
      else
        this.quizResult = "Excellent! Keep maintaining your healthy habits 🥗";
    },

    // Reset quiz
    resetQuiz() {
      this.quizAnswered = false;
      this.quizResult = "";
      this.selectedAnswer = null;
    },

    // Compute quiz button classes dynamically
    getQuizButtonClass(index) {
      return [
        "px-4 py-2 rounded-lg transition-all font-semibold",
        this.selectedAnswer === index
          ? "bg-green-400 text-black border-4 border-green-700"
          : "bg-green-200 text-green-900 hover:bg-green-300 focus:bg-green-300 focus:text-black focus:border-4 focus:border-green-500",
      ].join(" ");
    },
  },
};
</script>

<style scoped>
/* Ensure cursor pointer for interactive elements */
.cursor-pointer {
  cursor: pointer;
}
</style>
