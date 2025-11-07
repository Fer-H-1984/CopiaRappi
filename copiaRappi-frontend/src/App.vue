<template>
  <div>
    <header>
      <h1>CopiaRappi</h1>
      <nav>
  <router-link to="/">Home</router-link>
  <router-link to="/login">Login</router-link>
  <router-link to="/register">Registro</router-link> <!-- nuevo -->
</nav>

    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #42b883;
  color: white;
}

nav a {
  margin-left: 1rem;
  color: white;
  text-decoration: none;
}

nav a.router-link-active {
  text-decoration: underline;
}
</style>
