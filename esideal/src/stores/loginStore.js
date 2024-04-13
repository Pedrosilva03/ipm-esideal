import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
    state: () => ({
        user_id: localStorage.getItem('user_id') || "",
        user_name: localStorage.getItem('user_name') || "",
        user_password: localStorage.getItem('user_password') || "",
        user_job: localStorage.getItem('user_job') || ""
    }),

    getters: {
        getUser_id() {
            return this.user_id
        },

        getUser_name() {
            return this.user_name
        },

        getUser_password() {
            return this.user_password
        },
        
        getUser_job() {
            return this.user_job
        }
    },

    actions: {
        login(user_id, user_name, user_password, user_job) {
            this.user_id = user_id
            this.user_name = user_name
            this.user_password = user_password
            this.user_job = user_job
            localStorage.setItem('user_id', user_id)
            localStorage.setItem('user_name', user_name)
            localStorage.setItem('user_password', user_password)
            localStorage.setItem('user_job', user_job)
        },

        logout() {
            this.user_id = ""
            this.user_name = ""
            this.user_password = ""
            this.user_job = ""
            localStorage.removeItem('user_id')
            localStorage.removeItem('user_name')
            localStorage.removeItem('user_password')
            localStorage.removeItem('user_job')
        },

        isLogged() {
            return this.user_id !== ""
        }
    }
})
