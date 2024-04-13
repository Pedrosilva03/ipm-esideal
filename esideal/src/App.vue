<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useLoginStore } from './stores/loginStore';
  import Navbar from './components/navbar.vue';

  const route = useRoute();

  const loginStore = useLoginStore();

  const shouldShowNavbar = computed(() => {
    return loginStore.isLogged();
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
