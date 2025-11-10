<template>
  <div class="profile-container">
    <h1>Mi Perfil</h1>

    <div v-if="user">
      <form @submit.prevent="updateProfile">
        <input v-model="name" placeholder="Nombre" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Nueva contraseña" />
        <button type="submit" :disabled="loading">Actualizar Perfil</button>
      </form>
      <p v-if="profileMessage" :class="{ error: profileError }">{{ profileMessage }}</p>

      <!-- Órdenes solo para no-admin -->
      <div v-if="user.role !== 'ADMIN'">
        <h2>Órdenes</h2>
        <div v-if="ordersError" class="error-message">{{ ordersError }}</div>
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
          <button @click="toggleFavorite(vendor.id)" :disabled="loadingFavorites">
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

const profileMessage = ref('');
const profileError = ref(false);
const loading = ref(false);
const loadingFavorites = ref(false);

const authHeaders = () => ({ headers: { Authorization: `Bearer ${userStore.token}` } });

onMounted(async () => {
  if (!user.value) return;

  if (user.value.role !== 'ADMIN') {
    try {
      const res = await axios.get(`http://localhost:3000/user/${user.value.id}/orders`, authHeaders());
      orders.value = res.data;
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      ordersError.value = err.response?.data?.message || 'No se pudieron cargar las órdenes';
    }
  }

  favoriteVendors.value = (user.value.favorites || []).map(v => ({ ...v, isFavorite: true }));
});

const updateProfile = async () => {
  loading.value = true;
  profileMessage.value = '';
  profileError.value = false;

  try {
    const body = { name: name.value, email: email.value };
    if (password.value) body.password = password.value;

    const res = await axios.put(`http://localhost:3000/user/${user.value.id}`, body, authHeaders());
    userStore.user = res.data;
    localStorage.setItem('user', JSON.stringify(res.data));

    profileMessage.value = 'Perfil actualizado correctamente';
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    profileMessage.value = 'No se pudo actualizar el perfil';
    profileError.value = true;
  } finally {
    loading.value = false;
    password.value = '';
  }
};

const toggleFavorite = async (vendorId) => {
  loadingFavorites.value = true;
  try {
    await axios.put(`http://localhost:3000/user/${user.value.id}/favorites/${vendorId}`, {}, authHeaders());
    favoriteVendors.value = favoriteVendors.value.map(v =>
      v.id === vendorId ? { ...v, isFavorite: !v.isFavorite } : v
    );
  } catch (err) {
    console.error('Error al actualizar favorito:', err);
    alert('No se pudo actualizar el favorito');
  } finally {
    loadingFavorites.value = false;
  }
};

const logout = () => {
  userStore.logout();
  router.replace('/login');
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
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

button:hover:enabled {
  background-color: #369870;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin: 0.5rem 0;
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.error-message, .error {
  color: red;
  margin-top: 0.5rem;
}
</style>
