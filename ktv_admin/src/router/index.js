import Vue from 'vue'
import VueRouter from 'vue-router'
import {LoadingBar} from 'view-design'

// 路由
import Home from '@/views/Home'
import Login from '@/views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
    component:Home,
    children: [
    ]
  },
  {
    path:'/login',
    name:"Login",
    component:Login,
    meta:{
      title:"后台登录"
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) =>{
  LoadingBar.start();
  next();
})

export default router
