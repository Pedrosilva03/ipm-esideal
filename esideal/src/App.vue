<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import Navbar from './components/navbar.vue'
  const route = useRoute();

  const shouldShowNavbar = computed(() => {
    return route.path !== '/login';
  });
</script>

<template>
  <Navbar v-if="shouldShowNavbar" />
  <RouterView />
</template>

<script>
  export default {
    name: 'App',

    data() {
      return {
        login: false
      }
    },

    methods: {
      login() {
        this.login = true;
        console.log(this.login);
      },

      logout() {
        this.login = false;
        console.log(login);
      }
    }

  }
</script>
