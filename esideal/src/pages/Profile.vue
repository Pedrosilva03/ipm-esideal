<script setup>
import { useLoginStore } from '../stores/loginStore';

const loginStore = useLoginStore();

const id = loginStore.user_id;
const nome = loginStore.user_name;
const funcao = loginStore.user_job;
</script>

<template>
    <h2 class="perfil-title">Perfil de funcionário</h2>

    <div class="profile-info">
        <div class="profile-container">
            <img src="/imgs/profile-user.png">
            <p><b>Nome: </b>{{ nome }}</p>
            <p><b>ID de funcionário: </b>{{ id }}</p>
            <p><b>Função: </b>{{ funcao }}</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Profile'
}
</script>

<style scoped>
    .perfil-title {
        width: fit-content;
        color: white;
        background-color: #FF0000;
        padding: 10px 15px;
        border-radius: 20px;
        margin-left: 5%;
    }

    .profile-info {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .profile-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 15px;
        border-radius: 20px;
        background-color: #FF0000;
        width: 50%;
        color: white;
    }
</style>