<template>
  <div class="admin-container">
    <h2>Admin View</h2>
    <p>Solo admins pueden ver esto.</p>

    <div v-if="users.length">
      <h3>Lista de usuarios:</h3>
      <ul>
        <li v-for="u in users" :key="u.id">
          {{ u.name }} — {{ u.email }} — Rol: {{ u.role }}
          <button @click="deleteUser(u.id)">Eliminar</button>
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

const deleteUser = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

  try {
    await axios.delete(`http://localhost:3000/user/${id}`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    // Quitar de la lista local sin recargar
    users.value = users.value.filter(u => u.id !== id);
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    alert('No se pudo eliminar el usuario.');
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #c0392b;
}
</style>
