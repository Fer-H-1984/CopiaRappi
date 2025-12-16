<template>
  <div class="container my-5">
    <div class="card shadow-lg p-4 custom-card-bg">
      <div class="text-center">
        <h1 class="display-5 fw-bold text-primary mb-4">Bienvenido App Rappi</h1>
        <h2>Busca, encontra, decubri, experimenta</h2>
      </div>
      <div class="home-container"> 
        <div v-if="user">
          <p class="lead">Hola, <span class="fw-bold">{{ user.name }}</span>! Tu rol es: <span class="badge bg-success">{{ user.role }}</span></p>

          <nav class="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <router-link to="/profile" class="btn btn-outline-dark btn-lg">Mi Perfil</router-link>
            
            <router-link v-if="user.role === 'ADMIN'" to="/admin" class="btn btn-primary btn-lg">Panel Admin</router-link>
            
            <router-link v-if="user.role === 'CLIENT'" to="/user" class="btn btn-primary btn-lg">Área Usuario</router-link>
            
            <router-link v-if="user.role === 'DRIVER'" to="/driver" class="btn btn-primary btn-lg">Área Driver</router-link>
            
            <router-link v-if="user.role === 'VENDOR'" to="/vendor" class="btn btn-primary btn-lg">Área Vendor</router-link>
            
            <button @click="logout" class="btn btn-outline-danger btn-lg">
              <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
            </button>
          </nav>
        </div>

        <div v-else class="mt-4">
          <p>No has iniciado sesión. ¡Haz tu primer pedido!</p>
          <router-link to="/login" class="btn btn-success btn-lg px-5 shadow">
            Ir a Login
          </router-link>
        </div>
      </div>
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
/* ------------------------------------------- */
/* 1. PALETA DE COLORES */
/* ------------------------------------------- */

/* Color Primario (Acción/Marca): Un púrpura/magenta vibrante */
:root {
  --color-primary: #FF2E79; /* Rosa/Magenta fuerte */
  --color-secondary: #00BF63; /* Verde brillante */
  --color-background: #f4f6f9; /* Fondo muy claro */
  --color-text-dark: #2c3e50;
  --color-text-light: #ffffff;
}

/* ------------------------------------------- */
/* 2. CONTENEDOR GENERAL */
/* ------------------------------------------- */
.home-container {
  max-width: 700px;
  margin: 3rem auto;
  padding: 2.5rem;
  text-align: center;
  background-color: var(--color-background);
  border-radius: 12px; /* Bordes suaves */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); /* Sombra sutil */
}

/* Título */
h1 {
  color: var(--color-primary);
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

/* Subtítulos y párrafos de estado */
p {
  color: var(--color-text-dark);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

/* ------------------------------------------- */
/* 3. NAVEGACIÓN Y BOTONES */
/* ------------------------------------------- */
nav {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en pantallas pequeñas */
  justify-content: center;
  gap: 1rem; /* Espacio entre los elementos */
  margin-top: 2rem;
}

nav a,
nav button {
  /* Estilos base */
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px; /* Bordes redondeados */
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px; /* Asegura que los botones sean notables */
}

/* Estilo para los Router-Links (Áreas de Usuario/Admin/Vendor) */
nav a {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  border: 2px solid var(--color-primary);
}

nav a:hover {
  background-color: #ff5293; /* Tono más claro al pasar el mouse */
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 46, 121, 0.4);
}

/* Estilo para el botón de Cerrar Sesión */
nav button {
  background-color: transparent;
  color: var(--color-text-dark);
  border: 2px solid var(--color-text-dark); /* Borde simple y elegante */
  cursor: pointer;
}

nav button:hover {
  background-color: var(--color-text-dark);
  color: var(--color-text-light);
}

/* Estilo para el enlace de Login */
.home-container > div:last-child a {
    background-color: var(--color-secondary);
    color: var(--color-text-light);
    font-size: 1.1rem;
    padding: 1rem 2rem;
}

.home-container > div:last-child a:hover {
    background-color: #00e073;
    transform: none;
    box-shadow: 0 4px 10px rgba(0, 191, 99, 0.4);
}
</style>
