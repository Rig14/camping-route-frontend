import './assets/main.css'

import {createApp, ref} from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

createApp(App)
    .provide('axios', axios)
    .provide('error', ref(""))
    .use(router)
    .mount('#app')
