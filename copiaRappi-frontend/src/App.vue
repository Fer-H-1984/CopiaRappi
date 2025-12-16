<template>
  <div class="app-background-cocina">
    <header class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand fw-bold fs-3 text-white">
          Rappi App
        </router-link>

        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <nav class="navbar-nav">
            <router-link to="/" class="nav-link custom-nav-link me-3">Inicio</router-link>
            
            <router-link to="/login" class="btn btn-success me-2 custom-login-btn">
              Iniciar Sesión
            </router-link>
            
            <router-link to="/register" class="btn btn-outline-light custom-register-btn">
              Registro
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="py-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// No hay lógica compleja aquí, así que el script setup puede estar vacío.
</script>

<style scoped>
  .app-background-cocina {
    /* Altura y ancho total */
    min-height: 100vh;
    width: 100%;
    
    /* Ruta a tu imagen (AJUSTA ESTA RUTA) */
    background-image: url('assets/imagen/fondoPrincipal.jpg'); 
    
    /* Propiedades de fondo para que se vea bien */
    background-size: cover;        /* Cubrir toda la pantalla */
    background-position: center;   /* Centrar la imagen */
    background-attachment: fixed;  /* La imagen no se mueve al hacer scroll */
    background-repeat: no-repeat;
}

/* ------------------------------------------------ */
/* AJUSTE DE VISIBILIDAD (PARA QUE EL TEXTO SE LEA) */
/* ------------------------------------------------ */

/* Hacemos la barra de navegación semitransparente oscura */
.navbar {
    background-color: rgba(0, 0, 0, 0.5) !important; /* Seminegro sobre el fondo de imagen */
}

/* Y el contenido principal (donde se renderizan tus vistas) */
main {
    padding: 20px;
    /* Fondo semitransparente claro para el contenido */
    background-color: rgba(209, 128, 128, 0.5); 
    min-height: calc(100vh - 70px); /* Ajusta para que cubra la parte inferior */
}

/* Si tienes un contenedor principal dentro de main, también puedes darle fondo blanco */
.container {
    background-color: white; /* Blanco sólido para el contenido */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
/* Los estilos aquí son solo para ajustes finos que Bootstrap no maneja, 
  como el active state y la tipografía. 
*/

/* Efecto para el enlace activo (Home) que no es un botón */
.custom-nav-link.router-link-active {
  /* Añade un borde inferior para indicar la página activa */
  border-bottom: 3px solid white;
  padding-bottom: 5px;
  /* Eliminar el padding extra que pone Bootstrap al active */
  color: white !important; 
}

/* El botón de login (verde) debería destacar un poco más */
.custom-login-btn {
    font-weight: 600;
}

/* El color del texto del brand */
.navbar-brand {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>