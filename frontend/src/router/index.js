import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VendorsView from '../components/VendorsView.vue'
import UsersView from '../views/UsersView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/vendors', component: VendorsView },
  { path: '/users', component: UsersView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
