<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">


    <!-- Hero Section -->
    <section id="hero" class="text-center py-16 px-6 bg-green-50">
      <h1 class="text-4xl md:text-5xl font-bold text-green-700 mb-4">
        Public Health through Nutrition Education
      </h1>
      <p class="text-gray-700 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
        Promoting healthier lives through education, awareness, and community engagement.
      </p>
      <img src="@/assets/heroner.webp" alt="Healthy nutrition" class="mx-auto rounded-2xl shadow-xl w-full max-w-3xl" />
    </section>


    <!-- Nutrition Education -->
    <section id="education" class="py-16 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-green-700 mb-6">Nutrition Education</h2>
        <ul class="grid md:grid-cols-3 gap-6 text-left">
          <li class="bg-white rounded-2xl p-6 shadow-md">
            <h3 class="font-semibold text-green-700 mb-2">Balanced Diet</h3>
            <p class="text-gray-600">Understand the importance of a balanced diet for all age groups.</p>
          </li>
          <li class="bg-white rounded-2xl p-6 shadow-md">
            <h3 class="font-semibold text-green-700 mb-2">Healthy Habits</h3>
            <p class="text-gray-600">Learn small, practical changes for a healthier lifestyle.</p>
          </li>
          <li class="bg-white rounded-2xl p-6 shadow-md">
            <h3 class="font-semibold text-green-700 mb-2">Community Programs</h3>
            <p class="text-gray-600">Participate in local initiatives to promote public health nutrition.</p>
          </li>
        </ul>
      </div>
    </section>



    <!-- Programs -->
    <section id="programs" class="py-16 px-6 bg-green-50">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-green-700 mb-6">Our Programs</h2>
        <ul class="grid md:grid-cols-3 gap-6 text-left">
          <li class="bg-white rounded-2xl p-6 shadow-md">
            <img src="@/assets/2.webp" alt="Program" class="rounded-xl mb-3" />
            <h3 class="font-semibold text-green-700 mb-2">School Workshops</h3>
            <p class="text-gray-600">Interactive sessions teaching kids about healthy eating.</p>
          </li>
          <li class="bg-white rounded-2xl p-6 shadow-md">
            <img src="@/assets/3.webp" alt="Program" class="rounded-xl mb-3" />
            <h3 class="font-semibold text-green-700 mb-2">Community Cooking</h3>
            <p class="text-gray-600">Hands-on cooking classes for families to learn nutritious recipes.</p>
          </li>
          <li class="bg-white rounded-2xl p-6 shadow-md">
            <img src="@/assets/4.webp" alt="Program" class="rounded-xl mb-3" />
            <h3 class="font-semibold text-green-700 mb-2">Online Courses</h3>
            <p class="text-gray-600">Virtual lessons on nutrition, meal planning, and lifestyle tips.</p>
          </li>
        </ul>
      </div>
    </section>




    <!-- Contact Form -->
<section id="contact" class="py-16 px-6 bg-green-50">
  <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-12">
    <!-- Info Column -->
    <div class="md:w-1/2 text-center md:text-left">
      <h2 class="text-3xl font-bold text-green-700 mb-4">Join Our Mission</h2>
      <p class="text-gray-700 mb-6">
        Have a question, want to collaborate, or learn more about our programs? Reach out to us!
      </p>
      <p class="text-gray-700 font-semibold">📧 info@publichealthnutrition.org</p>
    </div>

    <!-- Form Column -->
    <form @submit.prevent="handleSubmit" class="md:w-1/2 bg-white p-8 rounded-2xl shadow-md border border-green-100 flex flex-col gap-4">
      <input 
        v-model="form.name" 
        type="text" 
        placeholder="Full Name" 
        required 
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400" 
      />
      <input 
        v-model="form.email" 
        type="email" 
        placeholder="Email" 
        required 
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400" 
      />
      <textarea 
        v-model="form.message" 
        rows="5" 
        placeholder="Message..." 
        required 
        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400"
      ></textarea>
      <button 
        type="submit" 
        class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold mt-2"
      >
        Send Message
      </button>
    </form>
  </div>
</section>

<!-- Health Quiz -->
<section id="quiz" class="py-16 px-6 bg-white text-center">
  <h2 class="text-3xl font-bold text-green-700 mb-4">Are You Eating Healthy?</h2>
  <p class="text-gray-600 mb-6">Answer a quick question to find out!</p>

  <div v-if="!quizAnswered">
    <p class="text-lg mb-4">How many servings of vegetables do you eat daily?</p>
    <div class="flex justify-center gap-4">
      <button @click="handleQuizAnswer(0)" class="px-4 py-2 bg-green-100 rounded-lg hover:bg-green-200">0-1</button>
      <button @click="handleQuizAnswer(1)" class="px-4 py-2 bg-green-100 rounded-lg hover:bg-green-200">2-3</button>
      <button @click="handleQuizAnswer(2)" class="px-4 py-2 bg-green-100 rounded-lg hover:bg-green-200">4+</button>
    </div>
  </div>

  <div v-else class="mt-6">
    <p class="text-lg font-semibold text-green-700">{{ quizResult }}</p>
    <button @click="resetQuiz" class="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Try Again</button>
  </div>
</section>


<!--  -->
<section class="py-12 bg-green-100 text-center">
  <h2 class="text-2xl font-bold text-green-700 mb-4">🌿 Today's Health Tips</h2>
  <ul>
    <li v-for="tip in randomTips" :key="tip" class="text-gray-700 mb-2">
      {{ tip }}
    </li>
  </ul>
</section>



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
      // 健康小贴士
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
    // 页面加载时随机取三条小贴士
    this.randomTips = this.allTips.sort(() => 0.5 - Math.random()).slice(0, 3);
  },
  methods: {
    handleSubmit() {
      alert(`✅ Thank you, ${this.form.name}! Your message has been sent.`);
      console.log("Form submitted:", this.form);
      this.form = { name: "", email: "", message: "" };
    },
    handleQuizAnswer(option) {
      this.quizAnswered = true;
      if (option === 0)
        this.quizResult = "Try to include more vegetables in your diet 🌿";
      if (option === 1)
        this.quizResult = "Good! You're on the right track 🥦";
      if (option === 2)
        this.quizResult = "Excellent! Keep maintaining your healthy habits 🥗";
    },
    resetQuiz() {
      this.quizAnswered = false;
      this.quizResult = "";
    },
  },
};
</script>


