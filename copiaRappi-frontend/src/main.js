import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'
import './assets/scss/_custom_variables.scss'; // Importar las variables personalizadas de SCSS

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);  // Pinia primero
app.use(router);

app.mount('#app');
