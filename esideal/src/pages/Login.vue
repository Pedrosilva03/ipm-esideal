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

                <div class="login-error">Login inválido</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',

        data() {
            return {
                user: '',
                password: ''
            }
        }, 

        methods: {
            login() {
                // Simulação de Login
                if (this.username === 'admin' && this.password === 'admin') {
                    this.$emit('login', { username: this.username, password: this.password });
                    this.$router.push('/servicos');
                } 
                
                else {
                    document.querySelector('.login-error').style.display = 'block';
                }
            }
        }
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