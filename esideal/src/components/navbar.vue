<template>
  <nav class="nav-container">
    <div class="logo">
        <img src="/esideal_logo.svg" class="nav-logo" />
    </div>

    <div class="nav-items">
      <router-link to="/perfil">
          <img src="/imgs/profile-user.png" class="nav-link" title="Perfil" />
      </router-link>

      <router-link to="/servicos_realizados">
          <img src="/imgs/history.png" class="nav-link" title="Histórico de serviços" />
      </router-link>

      <router-link to="/servicos">
          <img src="/imgs/task.png" class="nav-link" title="Lista de serviços" />
      </router-link>

      <router-link to="/login" @click="logout">
          <img src="/imgs/logout.png" class="nav-link" title="Logout" />
      </router-link>
    </div>
  </nav>
</template>

<script>
  import { useLoginStore } from '../stores/loginStore';

  export default {
    name: 'Navbar',

    methods: {
      logout() {
        const loginStore = useLoginStore();
        loginStore.logout();
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
    gap: 1.5rem;
  }

  .nav-link {
    cursor: pointer;
    width: 2rem;
    height: 2rem;
  }
</style>