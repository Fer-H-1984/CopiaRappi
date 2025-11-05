<script setup>
</script>

<template>
  <div>
    <header>
      <h1>CopiaRappi</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
      </nav>
    </header>

    <main>
      <!-- Aquí se renderizarán las vistas según la ruta -->
      <router-view />
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #42b883;
  color: white;
}

nav a {
  margin-left: 1rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav a.router-link-active {
  text-decoration: underline;
}

main {
  padding: 2rem;
}
</style>
