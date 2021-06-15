import Vue from 'vue'
import VueRouter from 'vue-router'

const Index = () => import('../views/index.vue')

Vue.use(VueRouter)

const routes = [
    {
        path: '/:id?',
        name: 'Index',
        component: Index,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior: to => {
        if (to.hash) {
            return {selector: to.hash};
        } else {
            return {x: 0, y: 0};
        }
    }
})

export default router