<template>
  <div>
    <h2>Vendors</h2>
    <ul>
      <li v-for="vendor in vendors" :key="vendor.id">{{ vendor.shopName }}</li>
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
      store.createVendor(newVendor.value)
      newVendor.value = { shopName: '', UserId: null }
    }

    onMounted(() => {
      store.fetchVendors()
    })

    return { vendors: store.vendors, newVendor, createVendor }
  },
}
</script>
