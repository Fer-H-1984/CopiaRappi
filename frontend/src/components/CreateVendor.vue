<template>
  <div>
    <h3>Create Vendor (Component)</h3>
    <form @submit.prevent="handleCreate">
      <input v-model="vendorName" placeholder="Shop Name" />
      <button type="submit">Create Vendor</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const vendorName = ref('')

    const handleCreate = () => {
      console.log('Vendor to create:', vendorName.value)
      vendorName.value = ''
    }

    return { vendorName, handleCreate }
  },
}
</script>
