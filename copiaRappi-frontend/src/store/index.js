import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,   // email, name, role, etc.
    token: null,
  }),
  actions: {
    async login({ email, password }) {
      const { data } = await axios.post('http://localhost:3000/auth/login', { email, password });
      this.user = data.user;       // <-- data.user debe traer role
      this.token = data.access_token;
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('token', this.token);
    },
    loadUserFromStorage() {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        this.user = JSON.parse(user);
        this.token = token;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});
