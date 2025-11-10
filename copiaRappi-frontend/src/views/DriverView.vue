<template>
  <div class="driver-container">
    <h2>Driver View</h2>
    <p>Solo drivers pueden ver esto.</p>

    <div v-if="orders.length">
      <h3>Mis órdenes:</h3>
      <ul>
        <li v-for="order in orders" :key="order.id">
          Orden #{{ order.id }} — Estado: {{ order.status }} — Total: ${{ order.total }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No tienes órdenes actualmente.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../store';
import axios from 'axios';

const userStore = useUserStore();
const orders = ref([]);

const user = computed(() => userStore.user);

const fetchOrders = async () => {
  if (!user.value) return;

  try {
    const { data } = await axios.get(
      `http://localhost:3000/driver/${user.value.id}/orders`,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );
    orders.value = data || [];
  } catch (err) {
    console.warn('⚠️ Error fetching orders, usando datos simulados');
    orders.value = [
      { id: 1, status: 'pendiente', total: 25.0 },
      { id: 2, status: 'en camino', total: 40.5 },
    ];
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.driver-container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}
</style>
