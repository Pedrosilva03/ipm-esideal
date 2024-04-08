<template>
  <nav class="nav-container">
    <div class="logo">
        <img src="/esideal_logo.svg" class="nav-logo" />
    </div>

    <div class="nav-items">
      <router-link to="/servicos">
          <img src="/imgs/task.png" class="nav-link" />
      </router-link>

      <router-link to="/login" @click="logout">
          <img src="/imgs/logout.png" class="nav-link" />
      </router-link>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Navbar',

    props: {
      loggedInUser: Object
    },

    methods: {
      logout() {
        this.$emit('logout');
      }
    }
  }
</script>

<style scoped>
  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #FF0000;
  }

  .nav-logo {
    width: 3rem;
  }

  .nav-items {
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    cursor: pointer;
    width: 2rem;
    height: 2rem;
  }
</style>