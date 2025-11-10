<template>
  <div class="vendor-container">
    <h2>Área del Vendor</h2>

    <!-- PERFIL DEL NEGOCIO -->
    <section>
      <h3>🏢 Perfil del negocio</h3>
      <form @submit.prevent="updateVendorProfile">
        <input v-model="vendor.shopName" placeholder="Nombre del negocio" required />
        <textarea v-model="vendor.description" placeholder="Descripción"></textarea>
        <input v-model="vendor.hours" placeholder="Horario" />
        <button type="submit">Actualizar Perfil</button>
      </form>
    </section>

    <!-- PRODUCTOS -->
    <section>
      <h3>🛒 Productos</h3>
      <div v-if="loadingProducts">Cargando productos...</div>
      <ul v-else-if="products.length">
        <li v-for="p in products" :key="p.id">
          {{ p.name }} — ${{ p.price.toFixed(2) }}
          <span v-if="p.discount"> (Promo: ${{ p.discount.toFixed(2) }})</span>
          <button @click="toggleProductActive(p.id)">
            {{ p.isActive ? 'Desactivar' : 'Activar' }}
          </button>
          <button @click="editProduct(p)">Editar</button>
          <button @click="deleteProduct(p.id)">Eliminar</button>
        </li>
      </ul>
      <p v-else>No tienes productos cargados.</p>
    </section>

    <!-- FORMULARIO PRODUCTO -->
    <section class="add-product">
      <h3>➕ Agregar / Editar Producto</h3>
      <form @submit.prevent="saveProduct">
        <input v-model="productForm.name" placeholder="Nombre del producto" required />
        <textarea v-model="productForm.description" placeholder="Descripción (opcional)"></textarea>
        <input v-model.number="productForm.price" type="number" placeholder="Precio" required min="0" step="0.01" />
        <input v-model.number="productForm.discount" type="number" placeholder="Descuento (opcional)" min="0" step="0.01" />
        <input v-model.number="productForm.stock" type="number" placeholder="Stock" min="1" />
        <select v-model.number="productForm.categoryId" required>
          <option value="" disabled>Seleccioná categoría</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <input v-model="productForm.imageURL" placeholder="URL de imagen (opcional)" />
        <label>
          <input type="checkbox" v-model="productForm.isActive" /> Activo
        </label>
        <button type="submit">{{ productForm.id ? 'Actualizar' : 'Agregar' }}</button>
      </form>
    </section>

    <!-- PEDIDOS -->
    <section>
      <h3>📦 Pedidos</h3>
      <div v-if="loadingOrders">Cargando pedidos...</div>
      <ul v-else-if="orders.length">
        <li v-for="o in orders" :key="o.id">
          Pedido #{{ o.id }} - {{ o.status }} - ${{ o.total }}
          <button @click="viewOrderDetails(o.id)">Ver detalles</button>
          <select v-model="o.status" @change="changeOrderStatus(o.id, o.status)">
            <option value="pendiente">Pendiente</option>
            <option value="aceptado">Aceptado</option>
            <option value="preparando">Preparando</option>
            <option value="listo">Listo</option>
          </select>
        </li>
      </ul>
      <p v-else>No tienes pedidos actualmente.</p>
    </section>

    <!-- DETALLES DEL PEDIDO -->
    <section v-if="selectedOrder">
      <h3>Detalles del Pedido #{{ selectedOrder.id }}</h3>
      <ul>
        <li v-for="item in selectedOrder.items" :key="item.id">
          {{ item.product.name }} x {{ item.quantity }} — ${{ item.total }}
        </li>
      </ul>
      <p>Total: ${{ selectedOrder.total }}</p>
      <button @click="selectedOrder = null">Cerrar</button>
    </section>

    <!-- REPORTES -->
    <section>
      <h3>📊 Reportes y Estadísticas</h3>
      <div v-if="stats">
        <p>Total pedidos: {{ stats.totalOrders }}</p>
        <p>Ingresos totales: ${{ stats.totalRevenue }}</p>
        <p>Pedidos completados: {{ stats.completedOrders }}</p>
      </div>
    </section>

    <!-- SOPORTE -->
    <section>
      <h3>💬 Contactar soporte</h3>
      <form @submit.prevent="createSupportTicket">
        <textarea v-model="supportMessage" placeholder="Escribe tu mensaje" required></textarea>
        <button type="submit">Enviar ticket</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useUserStore } from '../store';
import axios from 'axios';

const userStore = useUserStore();
const vendor = reactive({ id: userStore.user.vendorProfileId, shopName: '', description: '', hours: '' });

const products = ref([]);
// CATEGORIAS HARDOCODEADAS
const categories = ref([
  { id: 1, name: 'Bebidas' },
  { id: 2, name: 'Comida' },
  { id: 3, name: 'Electrónica' },
  { id: 4, name: 'Ropa' },
  { id: 5, name: 'Otros' },
]);
const orders = ref([]);
const selectedOrder = ref(null);
const stats = ref(null);

const loadingProducts = ref(false);
const loadingOrders = ref(false);

const productForm = reactive({
  id: null,
  name: '',
  description: '',
  price: 0,
  discount: 0,
  stock: 1,
  categoryId: null,
  imageURL: '',
  isActive: true,
});

const supportMessage = ref('');

// Headers con token
const authHeaders = () => ({ headers: { Authorization: `Bearer ${userStore.token}` } });

// Cargar productos
const fetchProducts = async () => {
  loadingProducts.value = true;
  try {
    const { data } = await axios.get(`http://localhost:3000/vendors/${vendor.id}/products`, authHeaders());
    products.value = data;
  } catch (err) {
    console.error('Error cargando productos:', err);
  } finally {
    loadingProducts.value = false;
  }
};

// Crear o actualizar producto
const saveProduct = async () => {
  try {
    if (!vendor.id) {
      alert('Vendor no válido');
      return;
    }
    if (!productForm.categoryId) {
      alert('Seleccioná una categoría válida');
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      description: productForm.description?.trim() || '',
      price: Number(productForm.price),
      discount: Number(productForm.discount) || 0,
      stock: Number(productForm.stock),
      categoryId: Number(productForm.categoryId),
      imageURL: productForm.imageURL?.trim() || '',
      isActive: !!productForm.isActive,
      vendorId: vendor.id
    };

    console.log('Payload a enviar:', payload);

    if (productForm.id) {
      await axios.patch(`http://localhost:3000/products/${productForm.id}`, payload, authHeaders());
    } else {
      await axios.post(`http://localhost:3000/products`, payload, authHeaders());
    }

    Object.assign(productForm, {
      id: null,
      name: '',
      description: '',
      price: 0,
      discount: 0,
      stock: 1,
      categoryId: null,
      imageURL: '',
      isActive: true
    });

    await fetchProducts();
    alert('Producto guardado correctamente');
  } catch (err) {
    console.error('Error guardando producto:', err.response?.data || err);
    alert(JSON.stringify(err.response?.data || err, null, 2));
  }
};

// Editar producto
const editProduct = (p) => Object.assign(productForm, p);

// Activar/desactivar producto
const toggleProductActive = async (id) => {
  const product = products.value.find(p => p.id === id);
  if (!product) return;
  try {
    await axios.patch(`http://localhost:3000/products/${id}`, { isActive: !product.isActive }, authHeaders());
    product.isActive = !product.isActive;
  } catch (err) {
    console.error('Error cambiando estado:', err);
  }
};

// Eliminar producto
const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/products/${id}`, authHeaders());
    products.value = products.value.filter(p => p.id !== id);
  } catch (err) {
    console.error('Error eliminando producto:', err);
  }
};

// Cargar pedidos
const fetchOrders = async () => {
  loadingOrders.value = true;
  try {
    const { data } = await axios.get(`http://localhost:3000/orders?vendorId=${vendor.id}`, authHeaders());
    orders.value = data;
  } catch (err) {
    console.error('Error cargando pedidos:', err);
  } finally {
    loadingOrders.value = false;
  }
};

// Ver detalles del pedido
const viewOrderDetails = async (id) => {
  try {
    const { data } = await axios.get(`http://localhost:3000/orders/${id}/summary`, authHeaders());
    selectedOrder.value = data;
  } catch (err) {
    console.error('Error cargando detalles del pedido:', err);
  }
};

// Cambiar estado de pedido
const changeOrderStatus = async (id, status) => {
  try {
    await axios.put(`http://localhost:3000/orders/${id}`, { status }, authHeaders());
  } catch (err) {
    console.error('Error actualizando estado:', err);
  }
};

// Actualizar perfil del vendor
const updateVendorProfile = async () => {
  try {
    const { data } = await axios.patch(`http://localhost:3000/vendors/${vendor.id}`, vendor, authHeaders());
    Object.assign(vendor, data);
    alert('Perfil actualizado');
  } catch (err) {
    console.error('Error actualizando perfil:', err);
  }
};

// Cargar estadísticas
const fetchStats = async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/vendors/${vendor.id}/statistics`, authHeaders());
    stats.value = data;
  } catch (err) {
    console.error('Error cargando estadísticas:', err);
  }
};

// Crear ticket de soporte
const createSupportTicket = async () => {
  try {
    await axios.post(`http://localhost:3000/support/contact`, { message: supportMessage.value }, authHeaders());
    supportMessage.value = '';
    alert('Ticket enviado');
  } catch (err) {
    console.error('Error enviando ticket:', err);
  }
};

onMounted(() => {
  // fetchCategories(); // eliminada porque ahora es hardcodeada
  fetchProducts();
  fetchOrders();
  fetchStats();
});
</script>

<style scoped>
.vendor-container {
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
  background: #f9f9f9;
  padding: 1rem;
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
  margin-left: 0.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}

.add-product form,
section form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

input, textarea, select {
  padding: 0.4rem;
  font-size: 1rem;
  width: 80%;
  max-width: 400px;
}
</style>
