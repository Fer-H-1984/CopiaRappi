import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminView from '../views/AdminView.vue';
import UserView from '../views/UserView.vue';
import DriverView from '../views/DriverView.vue';
import VendorView from '../views/VendorView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import { useUserStore } from '../store';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },

  // Rutas por rol
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: { requiresAuth: true, roles: ['CLIENT', 'ADMIN'] },
  },
  {
    path: '/driver',
    name: 'driver',
    component: DriverView,
    meta: { requiresAuth: true, roles: ['DRIVER'] },
  },
  {
    path: '/vendor',
    name: 'vendor',
    component: VendorView,
    meta: { requiresAuth: true, roles: ['VENDOR'] },
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfileView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard global de rutas
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const user = userStore.user;

  if (to.meta.requiresAuth && !user) return next('/login');
  if (to.meta.roles && user && !to.meta.roles.includes(user.role)) return next('/');
  
  next();
});

export default router;
