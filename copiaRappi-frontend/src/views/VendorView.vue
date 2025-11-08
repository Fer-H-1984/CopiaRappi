<template>
  <div class="vendor-container">
    <h2>Área del Vendor</h2>

    <section>
      <h3>📦 Pedidos</h3>
      <ul v-if="orders.length">
        <li v-for="o in orders" :key="o.id">
          Pedido #{{ o.id }} — {{ o.status }}
        </li>
      </ul>
      <p v-else>No tienes pedidos aún.</p>
    </section>

    <section>
      <h3>🛒 Productos</h3>
      <ul v-if="products.length">
        <li v-for="p in products" :key="p.id">
          {{ p.name }} — ${{ p.price }}
          <button @click="deleteProduct(p.id)">Eliminar</button>
        </li>
      </ul>
      <p v-else>No tienes productos cargados.</p>
    </section>

    <section class="add-product">
      <h3>➕ Agregar Producto</h3>
      <form @submit.prevent="createProduct">
        <input v-model="productName" placeholder="Nombre" required />
        <input v-model="productPrice" type="number" placeholder="Precio" required />
        <button type="submit">Agregar</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../store';

const userStore = useUserStore();
const orders = ref([]);
const products = ref([]);
const productName = ref('');
const productPrice = ref('');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${userStore.token}` }
});

// 🔹 Intentamos obtener pedidos reales; si no existen, usamos mock
const fetchOrders = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/vendor/orders', authHeaders());
    orders.value = data;
  } catch (err) {
    console.warn('⚠️ Backend sin endpoint /vendor/orders — usando datos simulados');
    orders.value = [
      { id: 1, status: 'pendiente' },
      { id: 2, status: 'en camino' },
      { id: 3, status: 'entregado' },
    ];
  }
};

// 🔹 Intentamos obtener productos reales; si no existen, usamos mock
const fetchProducts = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/vendor/products', authHeaders());
    products.value = data;
  } catch (err) {
    console.warn('⚠️ Backend sin endpoint /vendor/products — usando mock');
    products.value = [
      { id: 1, name: 'Pizza Napolitana', price: 15 },
      { id: 2, name: 'Empanadas de carne', price: 8 },
      { id: 3, name: 'Milanesa con papas', price: 20 },
    ];
  }
};

// 🔹 Crear producto (solo simulado por ahora)
const createProduct = async () => {
  try {
    await axios.post(
      'http://localhost:3000/vendor/products',
      { name: productName.value, price: productPrice.value },
      authHeaders()
    );
    productName.value = productPrice.value = '';
    fetchProducts();
  } catch (err) {
    console.warn('⚠️ Backend sin endpoint /vendor/products (POST) — simulando creación');
    const newId = Math.max(0, ...products.value.map(p => p.id)) + 1;
    products.value.push({
      id: newId,
      name: productName.value,
      price: parseFloat(productPrice.value)
    });
    productName.value = productPrice.value = '';
  }
};

// 🔹 Eliminar producto (también mock si falla)
const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/vendor/products/${id}`, authHeaders());
    fetchProducts();
  } catch (err) {
    console.warn('⚠️ Backend sin endpoint /vendor/products (DELETE) — simulando eliminación');
    products.value = products.value.filter(p => p.id !== id);
  }
};

// 🔹 Cargar datos al montar
onMounted(() => {
  fetchOrders();
  fetchProducts();
});
</script>

<style scoped>
.vendor-container {
  max-width: 700px;
  margin: 2rem auto;
  text-align: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

section {
  margin-bottom: 2rem;
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

button {
  margin-left: 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}

.add-product form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
}

input {
  padding: 0.4rem;
  font-size: 1rem;
  width: 80%;
  max-width: 300px;
}

.add-product button {
  background-color: #2c3e50;
}

.add-product button:hover {
  background-color: #1e2b38;
}
</style>
