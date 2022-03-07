import {createRouter, createWebHashHistory} from 'vue-router'

import Login from '../views/login.vue'
import Rule from '../views/rule.vue'
import Puzzle from '../views/puzzle.vue'

const routes = [
    {
        path: '/',
        name: 'Index',
        redirect: {name: "Login"}
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
    },
    {
        path: '/puzzle',
        name: 'Puzzle',
        component: Puzzle
    }
]

const router = createRouter({
    mode: 'hash',
    history: createWebHashHistory(),
    routes
})

export default router