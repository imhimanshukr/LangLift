import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import History from '../views/History.vue'
import Bookmarks from '../views/Bookmark.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: Login
  },
  {
    path: '/',
    name: 'HomePage',
    component: Home
  },
  {
    path: '/history',
    name: 'HistoryPage',
    component: History
  },
  {
    path: '/bookmarks',
    name: 'BookMarks',
    component: Bookmarks
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
