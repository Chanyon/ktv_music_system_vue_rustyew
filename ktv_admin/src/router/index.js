import Vue from 'vue'
import VueRouter from 'vue-router'
import {LoadingBar} from 'view-design'

// 路由
import Home from '@/views/Home'
import Login from '@/views/Login'
import Index from '@/views/Index'
import ManageMusic from '@/views/ManageMusic'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'Home',
    component:Home,
    children: [
      {path:'', redirect:"index"},
      {path:'index', name:"后台", component:Index},
      {path:'manage/music',name:"ManageMusic",component:ManageMusic}
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
