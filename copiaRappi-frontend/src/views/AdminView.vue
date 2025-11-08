<template>
  <div class="admin-container">
    <h2>Admin View</h2>
    <p>Solo admins pueden ver esto.</p>

    <div v-if="users.length">
      <h3>Lista de usuarios:</h3>
      <ul>
        <li v-for="u in users" :key="u.id">
          {{ u.name }} - {{ u.email }} - {{ u.role }}
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
      `http://localhost:3000/user`,
      {
        headers: { Authorization: `Bearer ${userStore.token}` },
      }
    );
    users.value = data;
  } catch (err) {
    console.error('Error fetching users:', err);
    users.value = [];
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
