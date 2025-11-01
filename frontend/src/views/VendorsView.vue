<template>
  <div>
    <h2>Vendors</h2>
    <ul>
      <li v-for="vendor in vendors" :key="vendor.id">
        {{ vendor.shopName }} (User ID: {{ vendor.UserId }})
      </li>
    </ul>

    <h3>Create Vendor</h3>
    <form @submit.prevent="createVendor">
      <input v-model="newVendor.shopName" placeholder="Shop Name" />
      <input v-model.number="newVendor.UserId" placeholder="User ID" type="number" />
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useVendorsStore } from '../stores/vendors'

export default {
  setup() {
    const store = useVendorsStore()
    const newVendor = ref({ shopName: '', UserId: null })

    const createVendor = () => {
      try {
        store.createVendor(newVendor.value)
      } catch {
        console.log('Backend no disponible, creando vendor de prueba.')
        const id = store.vendors.length + 1
        store.vendors.push({ id, ...newVendor.value })
      }
      newVendor.value = { shopName: '', UserId: null }
    }

    onMounted(() => {
      store.fetchVendors().catch(() => {
        console.log('Backend no disponible, cargando vendors de prueba.')
        store.vendors = [
          { id: 1, shopName: 'Tienda 1', UserId: 1 },
          { id: 2, shopName: 'Tienda 2', UserId: 2 },
        ]
      })
    })

    return { vendors: store.vendors, newVendor, createVendor }
  },
}
</script>
