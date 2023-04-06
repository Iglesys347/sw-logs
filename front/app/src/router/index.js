import LogsList from '../components/LogsList.vue'

import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        // redirect "/" to keywords page
        path: '/',
        redirect: '/apps'
    },
    {
        path: '/apps',
        name: 'AllAps',
        component: LogsList,
        props: { appName: null }
    },
    {
        path: '/app/1',
        name: 'App1',
        component: LogsList,
        props: { appName: "swlogs:app1" }
    },
    {
        path: '/app/2',
        name: 'App2',
        component: LogsList,
        props: { appName: "swlogs:app2" }
    },
    {
        path: '/app/3',
        name: 'App3',
        component: LogsList,
        props: { appName: "swlogs:app3" }
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router