<script setup>
import { ref } from 'vue';
import Axios from 'axios';
import { useRouter } from 'vue-router';
import { useLoginStore } from '../stores/loginStore';

const router = useRouter();

const loginStore = useLoginStore();

const username = ref('');
const password = ref('');

var loginError = ref(false);

const login = () => {
    Axios.get('http://localhost:3000/mechanics')
        .then(response => {
            const users = response.data;

            const user = users.find(user => user.id === username.value && user.pass === password.value);

            if (user) {
                loginStore.login(user.id, user.nome, user.pass, user.funcao);
                router.push({ name: 'Serviços' });
            } 
            
            else {
                console.error('Invalid user data received:', user);
                loginError.value = true;
            }
        })
        .catch(error => {
            console.error('Error logging in:', error);
            loginError.value = true;
        });
};

</script>

<template>
    <div class="login-container">
        <div class="logo-container">
            <img src="/esideal_logo.svg" class="esideal-logo" />
        </div>

        <div class="login-input-container">
            <div class="login-area">
                <h1 style="color: #FF0000">Login</h1>

                <div class="login-input-element">
                    <img src="/imgs/login_user.png">
                    <input v-model="username" type="text" placeholder="Usuário" />
                </div>

                <div class="login-input-element">
                    <img src="/imgs/login_password.png">
                    <input v-model="password" type="password" placeholder="Password" />
                </div>

                <div class="login-button" @click="login">Login</div>

                <div class="login-error" v-if="loginError">Login inválido</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
</script>

<style scoped>
.login-container {
    display: flex;
}

.logo-container, .login-input-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100vh;
    box-sizing: border-box;
    padding: 20px;
}

.logo-container {
    background-color: #FF0000;
}

.esideal-logo {
    width: 30%;
}

.login-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.login-input-element {
    display: flex;
    flex-direction: row;
    gap: 10px;
    border-bottom: 2px solid #FF0000;
    padding-bottom: 10px;
}

.login-button {
    background-color: #FF0000;
    color: white;
    font-size: 1.5rem;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all .1s ease-in-out;
}

.login-button:hover {
    transform: scale(1.05);
}

.login-error {
    color: red;
    display: none;
}
</style>
