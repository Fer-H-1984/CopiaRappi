<template>
  <div class="profile-container">
    <h1>Mi Perfil</h1>

    <div v-if="user">
      <form @submit.prevent="updateProfile">
        <input v-model="name" placeholder="Nombre" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Nueva contraseña" />
        <button type="submit">Actualizar Perfil</button>
      </form>

      <!-- Órdenes solo para no-admin -->
      <div v-if="user.role !== 'ADMIN'">
        <h2>Órdenes</h2>
        <div v-if="ordersError">{{ ordersError }}</div>
        <ul v-else>
          <li v-for="order in orders" :key="order.id">
            Orden #{{ order.id }} - {{ order.status }}
          </li>
        </ul>
      </div>

      <div v-else>
        <p>Los administradores no tienen órdenes personales.</p>
      </div>

      <h2>Vendors Favoritos</h2>
      <ul>
        <li v-for="vendor in favoriteVendors" :key="vendor.id">
          {{ vendor.name }}
          <button @click="toggleFavorite(vendor.id)">
            {{ vendor.isFavorite ? 'Quitar' : 'Agregar' }}
          </button>
        </li>
      </ul>

      <button @click="logout">Cerrar sesión</button>
    </div>

    <div v-else>
      <p>No has iniciado sesión.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../store';
import { useRouter } from 'vue-router';
import axios from 'axios';

const userStore = useUserStore();
const router = useRouter();

const user = computed(() => userStore.user);
const name = ref(user.value?.name || '');
const email = ref(user.value?.email || '');
const password = ref('');

const orders = ref([]);
const ordersError = ref('');
const favoriteVendors = ref([]);

// Axios config con token
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${userStore.token}` },
});

// Cargar órdenes y favoritos al montar
onMounted(async () => {
  if (!user.value) return;

  // Cargar órdenes solo si no es admin
  if (user.value.role !== 'ADMIN') {
    try {
      const res = await axios.get(`http://localhost:3000/user/${user.value.id}/orders`, authHeaders());
      orders.value = res.data;
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      ordersError.value = err.response?.data?.message || 'No se pudieron cargar las órdenes';
    }
  }

  // Cargar vendors favoritos
  favoriteVendors.value = (user.value.favorites || []).map(v => ({
    ...v,
    isFavorite: true
  }));
});

// Actualizar perfil
const updateProfile = async () => {
  try {
    const body = { name: name.value, email: email.value };
    if (password.value) body.password = password.value;

    const res = await axios.put(`http://localhost:3000/user/${user.value.id}`, body, authHeaders());

    // Actualizar store y localStorage
    userStore.user = res.data;
    localStorage.setItem('user', JSON.stringify(res.data));

    alert('Perfil actualizado correctamente');
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    alert('No se pudo actualizar el perfil');
  }
};

// Toggle vendor favorito
const toggleFavorite = async (vendorId) => {
  try {
    await axios.put(`http://localhost:3000/user/${user.value.id}/favorites/${vendorId}`, {}, authHeaders());

    // Actualizamos localmente
    favoriteVendors.value = favoriteVendors.value.map(v =>
      v.id === vendorId ? { ...v, isFavorite: !v.isFavorite } : v
    );

    alert('Favorito actualizado');
  } catch (err) {
    console.error('Error al actualizar favorito:', err);
    alert('No se pudo actualizar el favorito');
  }
};

// Cerrar sesión
const logout = () => {
  userStore.logout();
  router.replace('/login');
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
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
  border-radius: 4px;
}

button:hover {
  background-color: #369870;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin: 0.5rem 0;
}
</style>
