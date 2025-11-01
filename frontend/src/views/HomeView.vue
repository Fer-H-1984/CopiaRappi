<template>
  <div>
    <h2>Home Page</h2>
    <p>Bienvenido al Rappi Clone Frontend</p>

    <h3>Usuarios de prueba</h3>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useUsersStore } from '../stores/users'

export default {
  setup() {
    const store = useUsersStore()

    // Traer usuarios al montar la vista
    onMounted(() => {
      store.fetchUsers().catch(() => {
        console.log('Backend no disponible, usando datos de prueba.')
        store.users = [
          { id: 1, name: 'Test User 1', email: 'test1@example.com', age: 25 },
          { id: 2, name: 'Test User 2', email: 'test2@example.com', age: 30 },
        ]
      })
    })

    return { users: store.users }
  },
}
</script>
