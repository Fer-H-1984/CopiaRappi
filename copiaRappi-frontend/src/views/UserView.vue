<template>
  <div class="user-container container my-4">
    <div class="row mb-4">
      <div class="col-12 text-center">
        <h2 class="display-6 fw-bold text-primary">¡Haz tu pedido, {{ user?.name || 'Cliente' }}!</h2>
        <p class="text-muted">Explora restaurantes y tus órdenes recientes.</p>
      </div>
    </div>
    
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando datos...</p>
    </div>

    <div v-if="error" class="alert alert-danger error-message" role="alert">
      <i class="bi bi-x-octagon-fill me-2"></i> {{ error }}
    </div>

    <div class="row">
      
      <div class="col-md-7 col-lg-8">
        <div class="search-container card shadow-sm p-3 mb-4 custom-card">
          <h3 class="card-title fs-5 mb-3 text-dark">Buscar Restaurantes</h3>
          
          <div class="input-group">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control form-control-lg" 
              placeholder="Nombre, Categoría o tipo de Comida..."
              @input="searchRestaurants"
            />
            <button class="btn btn-primary" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <div class="results-area">
          
          <div v-if="selectedRestaurant" class="card shadow-lg p-3 custom-card">
            <h3 class="text-primary">{{ selectedRestaurant.name }}</h3>
            <p class="text-muted border-bottom pb-2">{{ selectedRestaurant.category }}</p>
            
            <ul class="list-group list-group-flush">
              <li v-for="item in selectedRestaurant.menu" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold">{{ item.name }}</span>
                  <p class="mb-0 text-sm-start text-muted">${{ item.price }}</p>
                </div>
                <div>
                  <button @click="addToCart(item)" class="btn btn-sm btn-success me-2">
                    <i class="bi bi-cart-plus me-1"></i> Añadir
                  </button>
                  <button @click="toggleFavoriteVendor(selectedRestaurant.id)" class="btn btn-sm btn-outline-warning">
                    <i class="bi bi-star"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
          
          <div v-else-if="searchResults.length > 0" class="card shadow-sm p-3 custom-card">
            <h4 class="card-title">Restaurantes encontrados:</h4>
            <ul class="list-group list-group-flush">
              <li v-for="restaurant in searchResults" :key="restaurant.id" 
                  class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold text-dark">{{ restaurant.name }}</span>
                  <p class="mb-0 text-muted">{{ restaurant.category }}</p>
                </div>
                <button @click="selectRestaurant(restaurant)" class="btn btn-sm btn-primary">
                  Ver Menú
                </button>
              </li>
            </ul>
          </div>

          <div v-else class="alert alert-info custom-card">
            <i class="bi bi-info-circle-fill me-2"></i> 
            Ingresa un término de búsqueda para encontrar tu restaurante ideal.
          </div>
          
        </div>
      </div>
      
      <div class="col-md-5 col-lg-4 mt-4 mt-md-0">
        
        <div v-if="cart.length > 0" class="card shadow-lg p-3 mb-4 custom-card border-success">
          <h3 class="card-title text-success"><i class="bi bi-cart4 me-2"></i> Tu Carrito</h3>
          
          <ul class="list-group list-group-flush">
            <li v-for="(item, index) in cart" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <span class="fw-bold">{{ item.name }}</span>
                <span class="badge bg-secondary ms-2">{{ item.quantity }}x</span>
              </div>
              <span>${{ (item.quantity * item.price).toFixed(2) }}</span>
            </li>
          </ul>
          
          <p class="lead fw-bold mt-3 border-top pt-2 text-end">Total: ${{ cartTotal.toFixed(2) }}</p>
          
          <button @click="checkout" class="btn btn-lg btn-success w-100">
            Finalizar Compra
          </button>
        </div>
        
        <div v-else-if="orders.length > 0" class="card shadow-sm p-3 custom-card border-secondary">
          <h3 class="card-title text-dark"><i class="bi bi-clock-history me-2"></i> Mis Órdenes</h3>
          
          <ul class="list-group list-group-flush">
            <li v-for="order in orders" :key="order.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                Orden #{{ order.id }} 
                <span :class="{'bg-success': order.status === 'Entregada', 'bg-warning': order.status === 'En Camino'}" class="badge text-dark ms-2">{{ order.status }}</span>
              </div>
              <span class="fw-bold">${{ order.total.toFixed(2) }}</span>
            </li>
          </ul>
        </div>
        
        <div v-else class="alert alert-warning text-center custom-card">
          <i class="bi bi-info-circle me-1"></i>
          ¡No tienes órdenes! ¿Qué esperas para pedir algo delicioso?
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
// (Mantener la lógica JS intacta)
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

// Las funciones fetchOrders, searchRestaurants, selectRestaurant, 
// addToCart, checkout, y toggleFavoriteVendor permanecen IGUAL.

const fetchOrders = async () => { /* ... (código) ... */ };
const searchRestaurants = async () => { /* ... (código) ... */ };

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
const checkout = async () => { /* ... (código) ... */ };

// Función para marcar restaurantes como favoritos
const toggleFavoriteVendor = async (vendorId) => { /* ... (código) ... */ };

// Obtener las órdenes al montar el componente
onMounted(() => {
  fetchOrders();
});
</script>


<style scoped>
/* ---------------------------------------------------- */
/* AJUSTES PARA BOOTSTRAP Y EL FONDO DE COCINA */
/* ---------------------------------------------------- */
.user-container {
  max-width: 1200px; /* Ampliamos un poco el ancho para el layout de 2 columnas */
  margin: auto;
}



/* Aplicamos el fondo semitransparente a las tarjetas para que se vea el fondo de cocina */
.custom-card {
    background-color: rgba(255, 255, 255, 0.9); /* Blanco semitransparente */
    border: none;
    border-radius: 0.75rem; /* Bordes redondeados */
}

/* Estilo para los botones de acción del carrito */
.btn-success {
    /* Usamos el verde de CopiaRappi para destacar la acción de compra */
    font-weight: 700;
}

/* Ítems del menú/carrito sin bordes visibles */
.list-group-item {
    background-color: transparent !important; /* Asegura que el fondo sea el de la card */
    border-color: rgba(0, 0, 0, 0.1) !important; /* Borde muy sutil */
}

/* Mensajes de error y alerta */
.error-message {
    font-weight: 600;
}

/* Ajuste del input de búsqueda */
.form-control-lg {
    border-radius: 0.5rem 0 0 0.5rem;
}

.input-group .btn {
    border-radius: 0 0.5rem 0.5rem 0;
}
</style>