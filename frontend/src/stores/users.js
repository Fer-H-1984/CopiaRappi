import { defineStore } from 'pinia'
import usersService from '../services/usersService'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
  }),
  actions: {
    async fetchUsers() {
      try {
        this.users = await usersService.getAllUsers()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },
    async createUser(userData) {
      try {
        const newUser = await usersService.createUser(userData)
        this.users.push(newUser)
      } catch (error) {
        console.error('Error creating user:', error)
      }
    },
  },
})
