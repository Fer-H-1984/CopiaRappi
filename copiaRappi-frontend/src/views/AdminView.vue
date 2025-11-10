<template>
  <div class="admin-container">
    <h2>Admin View</h2>
    <p>Solo admins pueden ver esto.</p>

    <div v-if="users.length">
      <h3>Lista de usuarios:</h3>
      <ul>
        <li v-for="u in users" :key="u.id">
          {{ u.name }} — {{ u.email }} — Rol: {{ u.role }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No hay usuarios registrados.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../store';
import axios from 'axios';

const userStore = useUserStore();
const users = ref([]);

const fetchUsers = async () => {
  try {
    const { data } = await axios.get(
      'http://localhost:3000/user',
      {
        headers: { Authorization: `Bearer ${userStore.token}` },
      }
    );
    users.value = data || [];
  } catch (err) {
    console.warn('⚠️ Error fetching users, usando mock');
    users.value = [
      { id: 1, name: 'Juan', email: 'juan@email.com', role: 'user' },
      { id: 2, name: 'Maria', email: 'maria@email.com', role: 'vendor' },
      { id: 3, name: 'Carlos', email: 'carlos@email.com', role: 'driver' },
    ];
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.admin-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #fff;
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
