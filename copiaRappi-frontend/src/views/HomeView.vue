<template>
  <div class="home-container">
    <h1>Bienvenido a CopiaRappi</h1>

    <div v-if="user">
      <p>Hola, {{ user.name }}! Tu rol es: {{ user.role }}</p>

      <nav>
        <router-link v-if="user.role === 'admin'" to="/admin">Ir a Admin</router-link>
        <router-link v-if="user.role === 'user'" to="/user">Ir a User</router-link>
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
import { useUserStore } from '../store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

userStore.loadUserFromStorage();

const user = computed(() => userStore.user);

const logout = () => {
  userStore.logout();
  router.push('/login');
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
