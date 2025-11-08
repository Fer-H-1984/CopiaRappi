<template>
  <div class="home-container">
    <h1>Bienvenido a CopiaRappi</h1>

    <div v-if="user">
      <p>Hola, {{ user.name }}! Tu rol es: {{ user.role }}</p>

      <nav>
        <router-link to="/profile">Mi Perfil</router-link>
        <router-link v-if="user.role === 'ADMIN'" to="/admin">Panel Admin</router-link>
        <router-link v-if="user.role === 'CLIENT'" to="/user">Área Usuario</router-link>
        <router-link v-if="user.role === 'DRIVER'" to="/driver">Área Driver</router-link>
        <router-link v-if="user.role === 'VENDOR'" to="/vendor">Área Vendor</router-link>
        <button @click="logout">Cerrar sesión</button>
      </nav>
    </div>

    <div v-else>
      <p>No has iniciado sesión.</p>
      <router-link to="/login">Ir a Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';

const userStore = useUserStore();
const router = useRouter();

// Carga el usuario desde localStorage si existe
onMounted(() => userStore.loadUserFromStorage());

const user = computed(() => userStore.user);

const logout = () => {
  userStore.logout();
  router.replace('/login');
};
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

nav {
  margin-top: 1rem;
}

nav a,
nav button {
  margin: 0 0.5rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

nav a {
  background-color: #42b883;
  color: white;
}

nav button {
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
}

nav a:hover {
  background-color: #369870;
}

nav button:hover {
  background-color: #c0392b;
}
</style>
