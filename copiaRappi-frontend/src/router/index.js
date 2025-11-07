import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue'; // nueva
import AdminView from '../views/AdminView.vue';
import UserView from '../views/UserView.vue';
import DriverView from '../views/DriverView.vue';
import VendorView from '../views/VendorView.vue';
import { useUserStore } from '../store';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView }, // nueva
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: { requiresAuth: true, roles: ['user', 'admin'] },
  },
  {
    path: '/driver',
    name: 'driver',
    component: DriverView,
    meta: { requiresAuth: true, roles: ['driver'] },
  },
  {
    path: '/vendor',
    name: 'vendor',
    component: VendorView,
    meta: { requiresAuth: true, roles: ['vendor'] },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  try {
    const userStore = useUserStore();
    const user = userStore.user;

    if (to.meta.requiresAuth && !user) return next('/login');
    if (to.meta.roles && user && !to.meta.roles.includes(user.role)) return next('/');

    next();
  } catch (error) {
    console.error('Error en router.beforeEach:', error);
    next('/');
  }
});

export default router;
