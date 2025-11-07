<template>
  <div class="register-container">
    <h1>Registro</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Nombre" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <select v-model="role" required>
        <option disabled value="">Selecciona un rol</option>
        <option value="user">Usuario</option>
        <option value="driver">Driver</option>
        <option value="vendor">Vendor</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Registrarse</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const errorMessage = ref('');

const router = useRouter();

const handleRegister = async () => {
  errorMessage.value = '';
  try {
    await axios.post('http://localhost:3000/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });
    router.replace('/login'); // después de registrar → login
  } catch (err) {
    console.error(err);
    errorMessage.value = 'No se pudo registrar. Verifica los datos.';
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, select {
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
