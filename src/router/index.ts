import {createMemoryHistory, createRouter} from 'vue-router'
import Home from '../views/Home.vue'
import AddRoute from "../views/AddRoute.vue";
import CampingRoute from "../views/CampingRoute.vue";

const routes = [
    {
        name: 'Home',
        path: '/',
        component: Home
    },
    {
        name: 'AddRoute',
        path: '/add_route',
        component: AddRoute
    },
    {
        name: 'CampingRoute',
        path: '/camping_route/:id',
        component: CampingRoute
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router
