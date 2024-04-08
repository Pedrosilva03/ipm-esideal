<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import Navbar from './components/navbar.vue'
  import Footer from './components/footer.vue'
  const route = useRoute();

  const shouldShowNavbar = computed(() => {
    return route.path !== '/login';
  });
</script>

<template>
  <Navbar v-if="shouldShowNavbar" @logout="handleLogout" :loggedInUser="loggedInUser" />
  <RouterView @login="handleLogin" />
  <Footer v-if="shouldShowNavbar" />
</template>

<script>
  export default {
    name: 'App',

    setup() {
      const loggedInUser = ref(null);

      const handleLogin = (loginData) => {
        loggedInUser.value = loginData;
      };

      const handleLogout = () => {
        loggedInUser.value = null;
      };

      return {
        handleLogin,
        handleLogout
      };
    }
  }
</script>
