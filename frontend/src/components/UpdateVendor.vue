<template>
  <div>
    <h3>Update Vendor (Component)</h3>
    <form @submit.prevent="handleUpdate">
      <input v-model="vendorName" placeholder="New Shop Name" />
      <button type="submit">Update Vendor</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const vendorName = ref('')

    const handleUpdate = () => {
      console.log('Vendor updated to:', vendorName.value)
      vendorName.value = ''
    }

    return { vendorName, handleUpdate }
  },
}
</script>
