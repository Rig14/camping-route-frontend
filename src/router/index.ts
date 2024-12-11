import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import CampingRoute from "../views/CampingRoute.vue";
import SearchResults from "../views/SearchResults.vue";
import Profile from "../views/Profile.vue";

const routes = [
    {
        name: 'Home',
        path: '/',
        component: Home
    },
    {
        name: 'CampingRoute',
        path: '/camping_route/:id',
        component: CampingRoute
    },
    {
        name: 'SearchResults',
        path: '/search-results',
        component: SearchResults
    },
    {
        name: 'Profile',
        path: '/profile/:id',
        component: Profile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
