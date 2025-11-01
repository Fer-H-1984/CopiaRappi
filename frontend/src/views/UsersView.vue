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
      try {
        store.createUser(newUser.value)
      } catch {
        console.log('Backend no disponible, creando usuario de prueba.')
        const id = store.users.length + 1
        store.users.push({ id, ...newUser.value })
      }
      newUser.value = { name: '', email: '', age: null }
    }

    onMounted(() => {
      store.fetchUsers().catch(() => {
        console.log('Backend no disponible, cargando usuarios de prueba.')
        store.users = [
          { id: 1, name: 'Test User 1', email: 'test1@example.com', age: 25 },
          { id: 2, name: 'Test User 2', email: 'test2@example.com', age: 30 },
        ]
      })
    })

    return { users: store.users, newUser, createUser }
  },
}
</script>
