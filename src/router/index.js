// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router"

import Home from "../views/Home.vue"
import AgeStories from "../views/AgeStories.vue"
import StoryPage from "../views/StoryPage.vue"
import AboutContactPage from "../views/AboutContactPage.vue"

const routes = [
    { path: "/", component: Home },
    { path: "/vozrast/:age", component: AgeStories },
    { path: "/prikazna/:id", component: StoryPage },
    { path: "/za-nas", component: AboutContactPage },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})