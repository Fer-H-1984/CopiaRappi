<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Ingresar</button>
    </form>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../store';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    await userStore.login({ email: email.value, password: password.value });
    
    // Redirección según rol
    switch (userStore.user.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'user':
        router.push('/user');
        break;
      case 'driver':
        router.push('/driver');
        break;
      case 'vendor':
        router.push('/vendor');
        break;
      default:
        router.push('/');
    }
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Email o contraseña incorrectos';
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
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
</style>
