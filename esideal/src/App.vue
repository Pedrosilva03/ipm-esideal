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
  <Navbar v-if="shouldShowNavbar" />
  <RouterView />
  <Footer v-if="shouldShowNavbar" />
</template>

<script>
  export default {
    name: 'App'

  }
</script>
