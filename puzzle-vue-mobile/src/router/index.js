import {createRouter, createWebHashHistory} from 'vue-router'

import Puzzle from '../views/Puzzle.vue'
import Login from '../views/login.vue'
import Rule from '../views/rule.vue'

const routes = [
    {
        path: '/',
        name: 'Index',
        redirect: {name: "Login"}
    },
    {
        path: '/puzzle',
        name: 'Puzzle',
        component: Puzzle
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/rule',
        name: 'Rule',
        component: Rule
    }
]

const router = createRouter({
    mode: 'hash',
    history: createWebHashHistory(),
    routes
})

export default router