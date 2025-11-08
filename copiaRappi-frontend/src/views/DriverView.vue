<template>
  <div class="driver-container">
    <h2>Driver View</h2>
    <p>Solo drivers pueden ver esto.</p>

    <div v-if="orders.length">
      <h3>Mis órdenes:</h3>
      <ul>
        <li v-for="order in orders" :key="order.id">
          Orden #{{ order.id }} - {{ order.status }} - {{ order.total }}$
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

// Computed para acceder al user
const user = computed(() => userStore.user);

const fetchOrders = async () => {
  if (!user.value) return;

  try {
    const { data } = await axios.get(
      `http://localhost:3000/user/${user.value.id}/orders`,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );
    orders.value = data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    orders.value = [];
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
