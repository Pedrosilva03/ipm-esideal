import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
    state: () => ({
        user_id: "",
        user_name: "",
        user_password: "",
        user_job: ""
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
        },
        logout() {
            this.user_id = ""
            this.user_name = ""
            this.user_password = ""
            this.user_job = ""
        },
        isLogged() {
            return this.user_id !== ""
        }
    }
})
