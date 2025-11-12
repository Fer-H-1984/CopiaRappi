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
          {{ p.name }} — ${{ Number(p.price).toFixed(2) }}
          <span v-if="p.discount"> (Promo: ${{ Number(p.discount).toFixed(2) }})</span>
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
          Pedido #{{ o.id }} - {{ o.status }} - ${{ Number(o.total).toFixed(2) }}
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
          {{ item.product.name }} x {{ item.quantity }} — ${{ Number(item.total).toFixed(2) }}
        </li>
      </ul>
      <p>Total: ${{ Number(selectedOrder.total).toFixed(2) }}</p>
      <button @click="selectedOrder = null">Cerrar</button>
    </section>

    <!-- REPORTES -->
    <section>
      <h3>📊 Reportes y Estadísticas</h3>
      <div v-if="stats">
        <p>Total pedidos: {{ stats.totalOrders }}</p>
        <p>Ingresos totales: ${{ Number(stats.totalRevenue).toFixed(2) }}</p>
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
// CATEGORIAS HARDCODEADAS
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

const authHeaders = () => ({ headers: { Authorization: `Bearer ${userStore.token}` } });

// Cargar productos y asegurar que price y discount sean números
const fetchProducts = async () => {
  loadingProducts.value = true;
  try {
    const { data } = await axios.get(`http://localhost:3000/vendors/${vendor.id}/products`, authHeaders());
    products.value = data.map(p => ({
      ...p,
      price: Number(p.price),
      discount: p.discount ? Number(p.discount) : 0
    }));
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

const editProduct = (p) => Object.assign(productForm, p);

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

const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/products/${id}`, authHeaders());
    products.value = products.value.filter(p => p.id !== id);
  } catch (err) {
    console.error('Error eliminando producto:', err);
  }
};

const fetchOrders = async () => {
  loadingOrders.value = true;
  try {
    const { data } = await axios.get(`http://localhost:3000/orders?vendorId=${vendor.id}`, authHeaders());
    orders.value = data.map(o => ({ ...o, total: Number(o.total) }));
  } catch (err) {
    console.error('Error cargando pedidos:', err);
  } finally {
    loadingOrders.value = false;
  }
};

const viewOrderDetails = async (id) => {
  try {
    const { data } = await axios.get(`http://localhost:3000/orders/${id}/summary`, authHeaders());
    selectedOrder.value = {
      ...data,
      total: Number(data.total),
      items: data.items.map(i => ({ ...i, total: Number(i.total) }))
    };
  } catch (err) {
    console.error('Error cargando detalles del pedido:', err);
  }
};

const changeOrderStatus = async (id, status) => {
  try {
    await axios.put(`http://localhost:3000/orders/${id}`, { status }, authHeaders());
  } catch (err) {
    console.error('Error actualizando estado:', err);
  }
};

const updateVendorProfile = async () => {
  try {
    const { data } = await axios.patch(`http://localhost:3000/vendors/${vendor.id}`, vendor, authHeaders());
    Object.assign(vendor, data);
    alert('Perfil actualizado');
  } catch (err) {
    console.error('Error actualizando perfil:', err);
  }
};

const fetchStats = async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/vendors/${vendor.id}/statistics`, authHeaders());
    stats.value = {
      ...data,
      totalRevenue: Number(data.totalRevenue)
    };
  } catch (err) {
    console.error('Error cargando estadísticas:', err);
  }
};

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
