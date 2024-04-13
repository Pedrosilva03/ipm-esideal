import { createWebHistory, createRouter } from "vue-router" 
import Login from './pages/Login.vue'
import Servicos from './pages/Servicos.vue'
import Pag_Servico from './pages/Pag_Servico.vue'
import Servicos_Realizados from './pages/Servicos_realizados.vue'
import Perfil from './pages/Profile.vue'

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
        name: "Serviços",
        component: Servicos,
    },

    {
        path: "/servicos/:id",  
        name: "Página de serviço",
        component: Pag_Servico,
        props: true
    },

    {
        path: "/servicos_realizados",
        name: "Serviços Realizados",
        component: Servicos_Realizados
    },

    {
        path: "/perfil",
        name: "Perfil",
        component: Perfil
    }
]

const router = createRouter({   
    history: createWebHistory(),  
     routes: links, 
    })  

    router.afterEach((to) => {
        const pageTitle = to.meta.title || to.name || 'Your Default Title';
        document.title = pageTitle;
    });
    
export default router