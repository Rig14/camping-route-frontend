import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

createApp(App)
    .provide('axios', axios)
    .use(router)
    .mount('#app')
