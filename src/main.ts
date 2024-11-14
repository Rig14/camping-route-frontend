import './assets/main.css'

import {createApp, ref} from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import {createPinia} from "pinia";

const pinia = createPinia()

createApp(App)
    .provide('axios', axios)
    .provide('error', ref(""))
    .use(router)
	.use(pinia)
    .mount('#app')

const token = localStorage.getItem('user-token');
if (token) {
	axios.defaults.headers.common['Authorization'] = "Bearer " + token
}
