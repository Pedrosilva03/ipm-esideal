import { createWebHistory, createRouter } from "vue-router" 
import Login from './pages/Login.vue'
import Servicos from './pages/Servicos.vue'
import Pag_Servico from './pages/Pag_Servico.vue'

const links = [
    {
        path: "/",
        redirect: "/login"
    },

    {
        path: "/login",     
        name: "Login",     
        component: Login,
    },

    {
        path: "/servicos",
        name: "Servicos",
        component: Servicos,
    },

    {
        path: "/servicos/:id",  
        name: "Servico",
        component: Pag_Servico,
    }
]

const router = createRouter({   
    history: createWebHistory(),  
     routes: links, 
    })  
    
export default router