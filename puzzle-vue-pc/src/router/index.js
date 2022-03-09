import {createRouter, createWebHashHistory} from 'vue-router'

import Rule from '../views/rule.vue'
import Puzzle from '../views/puzzle.vue'
import Login from '../views/login.vue'
import Temp from '../views/temp.vue'

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
    },
    {
        path: '/temp',
        name: 'Temp',
        component: Temp
    }
]

const router = createRouter({
    mode: 'hash',
    history: createWebHashHistory(),
    routes
})

export default router