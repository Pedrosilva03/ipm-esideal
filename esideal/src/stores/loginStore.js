// persist: https://github.com/prazdevs/pinia-plugin-persistedstate

import { defineStore } from 'pinia'

export const useLoginStore = defineStore('loginStore', {
    state: () => {
        return {
            user_id: "",
            user_name: "",
            user_password: "",
            user_job: ""
        }
    },

    persist: {
        Storage: sessionStorage
    },

    actions: {
        login(user_id, user_name, user_password, user_job) {
            this.user_id = user_id
            this.user_name = user_name
            this.user_password = user_password
            this.user_job = user_job
        },

        logout() {
            this.$patch({
                user_id: "",
                user_name: "",
                user_password: "",
                user_job: ""
            })
        }
    }
})
