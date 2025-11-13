<template>
  <div class="user-container">
    <h2>User View</h2>
    <p>Solo usuarios normales o admins pueden ver esto.</p>

    <div v-if="loading">Cargando órdenes...</div>

    <div v-else-if="orders.length">
      <h3>Mis órdenes:</h3>
      <div>
        <ul>
          <li v-for="order in orders" :key="order.id">
            Orden #{{ order.id }} - {{ order.status }} - {{ order.total }}$
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>No tienes órdenes actualmente.</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../store';
import axios from 'axios';

const userStore = useUserStore();
const orders = ref([]);
const error = ref('');
const loading = ref(false);

const user = computed(() => userStore.user);

const fetchOrders = async () => {
  if (!user.value) return;

  loading.value = true;
  error.value = '';

  try {
    const { data } = await axios.get(
      `http://localhost:3000/user/${user.value.id}/orders`,
      {
        headers: { Authorization: `Bearer ${userStore.token}` },
      }
    );
    orders.value = data || [];
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = 'No se pudieron cargar tus órdenes. Intenta nuevamente.';
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.user-container {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
