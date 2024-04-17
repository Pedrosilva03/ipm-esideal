<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import Navbar from './components/navbar.vue';

  const route = useRoute();

  const shouldShowNavbar = computed(() => {
    return route.name !== 'Login';
  });
</script>

<template>
  <Navbar v-if="shouldShowNavbar" />
  <RouterView />
</template>

<script>
  export default {
    name: 'App'
  }
</script>
