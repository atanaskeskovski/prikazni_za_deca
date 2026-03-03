// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ MUST: load global CSS
import './style.css'

createApp(App).use(router).mount('#app')