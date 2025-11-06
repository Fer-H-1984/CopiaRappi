<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../store';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    await userStore.login({ email: email.value, password: password.value });

    // Redirige según el rol del usuario
    let path = '/';
    switch (userStore.user.role) {
      case 'admin':
        path = '/admin';
        break;
      case 'user':
        path = '/user';
        break;
      case 'driver':
        path = '/driver';
        break;
      case 'vendor':
        path = '/vendor';
        break;
    }

    router.replace(path); // 🔹 reemplaza la ruta actual sin necesidad de recargar
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Email o contraseña incorrectos';
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
