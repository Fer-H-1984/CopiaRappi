<template>
  <div>
    <h2>Users</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>

    <h3>Create User</h3>
    <form @submit.prevent="createUser">
      <input v-model="newUser.name" placeholder="Name" />
      <input v-model="newUser.email" placeholder="Email" />
      <input v-model.number="newUser.age" placeholder="Age" type="number" />
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../stores/users'

export default {
  setup() {
    const store = useUsersStore()
    const newUser = ref({ name: '', email: '', age: null })

    const createUser = () => {
      store.createUser(newUser.value)
      newUser.value = { name: '', email: '', age: null }
    }

    onMounted(() => {
      store.fetchUsers()
    })

    return { users: store.users, newUser, createUser }
  },
}
</script>
