<template>
  <div class="user-container">
    <h2>User View</h2>
    <p>Solo usuarios normales o admins pueden ver esto.</p>

    <div v-if="loading">Cargando órdenes...</div>

    <!-- Búsqueda de restaurantes -->
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Buscar restaurante por nombre o categoría"
        @input="searchRestaurants"
      />
      <div v-if="searchResults.length > 0">
        <ul>
          <li v-for="restaurant in searchResults" :key="restaurant.id">
            {{ restaurant.name }} - {{ restaurant.category }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No se encontraron restaurantes.</p>
      </div>
    </div>

    <!-- Ver menú completo -->
    <div v-if="selectedRestaurant">
      <h3>Menú de {{ selectedRestaurant.name }}</h3>
      <ul>
        <li v-for="item in selectedRestaurant.menu" :key="item.id">
          {{ item.name }} - {{ item.price }}$
          <button @click="addToCart(item)">Añadir al carrito</button>
        </li>
      </ul>
    </div>

    <!-- Ver carrito -->
    <div v-if="cart.length > 0">
      <h3>Carrito</h3>
      <ul>
        <li v-for="item in cart" :key="item.id">
          {{ item.name }} - {{ item.quantity }} x {{ item.price }}$
        </li>
      </ul>
      <p>Total: {{ cartTotal }}$</p>
      <button @click="checkout">Finalizar compra</button>
    </div>

    <!-- Ver órdenes -->
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
    
    <!-- Si no hay órdenes -->
    <div v-else>
      <p>No tienes órdenes actualmente.</p>
    </div>

    <!-- Error en carga -->
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
const searchQuery = ref('');
const searchResults = ref([]);
const selectedRestaurant = ref(null);
const cart = ref([]);
const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.quantity * item.price), 0);
});

const user = computed(() => userStore.user);

// Función para cargar las órdenes
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

// Función para buscar restaurantes
const searchRestaurants = async () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }

  // Limpiar y formatear el nombre ingresado por el usuario
  const cleanedQuery = searchQuery.value.trim().toLowerCase();  // Limpiar y pasar a minúsculas
  console.log("Buscando restaurante:", cleanedQuery);

  try {
    // Cambiar la URL para apuntar al endpoint correcto
    const { data } = await axios.get(
      `http://localhost:3000/vendors`,  // Cambiar "restaurants" por "vendors"
      {
        headers: { Authorization: `Bearer ${userStore.token}` },
      }
    );
    searchResults.value = data;
  } catch (err) {
    console.error('Error buscando restaurantes:', err);
    error.value = 'No se pudo realizar la búsqueda. Intenta nuevamente.';
  }
};


// Función para seleccionar un restaurante y ver su menú
const selectRestaurant = (restaurant) => {
  selectedRestaurant.value = restaurant;
};

// Función para añadir artículos al carrito
const addToCart = (item) => {
  const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.value.push({ ...item, quantity: 1 });
  }
};

// Función para proceder con la compra
const checkout = async () => {
  if (cart.value.length === 0) {
    error.value = 'El carrito está vacío.';
    return;
  }

  try {
    const orderData = {
      userId: user.value.id,
      items: cart.value,
      total: cartTotal.value,
    };
    const { data } = await axios.post('http://localhost:3000/orders', orderData, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
    orders.value.push(data); // Añadimos la nueva orden a las órdenes
    cart.value = []; // Limpiamos el carrito
  } catch (err) {
    console.error('Error realizando la compra:', err);
    error.value = 'No se pudo realizar la compra. Intenta nuevamente.';
  }
};

// Función para marcar restaurantes como favoritos
const toggleFavoriteVendor = async (vendorId) => {
  try {
    await axios.post(
      `http://localhost:3000/user/${user.value.id}/favorite-vendor/${vendorId}`,
      {},
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    // Aquí podrías actualizar la lista de restaurantes favoritos en el estado del usuario
  } catch (err) {
    console.error('Error al marcar restaurante como favorito:', err);
    error.value = 'No se pudo marcar el restaurante como favorito.';
  }
};

// Obtener las órdenes al montar el componente
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

.search-container {
  margin-bottom: 1rem;
}

.search-container input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
}
</style>
