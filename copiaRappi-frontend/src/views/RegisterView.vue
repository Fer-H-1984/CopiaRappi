<template>
  <div class="register-container">
    <h1>Registro</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Nombre" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      
      <select v-model="role" required>
        <option disabled value="">Selecciona un rol</option>
        <option value="CLIENT">Usuario</option>
        <option value="DRIVER">Driver</option>
        <option value="VENDOR">Vendor</option>
        <option value="ADMIN">Admin</option>
      </select>

      <div v-if="role === 'DRIVER'" class="role-form">
        <h3>Datos del Driver y Vehículo</h3>
        
        <input v-model="phone" type="tel" placeholder="Teléfono (Ej: +569...)" required />

        <select v-model="vehicleType" required>
          <option disabled value="">Tipo de Vehículo</option>
          <option value="MOTORCYCLE">MOTO</option>
          <option value="BICYCLE">BICI</option>
          <option value="CAR">AUTO</option>
        </select>
        <input v-model="licensePlate" type="text" placeholder="Patente / Matrícula" required />
        <input v-model="vehicleBrand" type="text" placeholder="Marca del Vehículo (Ej: Yamaha)" />
        <input v-model="vehicleModel" type="text" placeholder="Modelo del Vehículo (Ej: FZ 25)" required />
        
        <input v-model="driverLicense" type="text" placeholder="Número de Licencia de Conducir" required />
      </div>

      <div v-else-if="role === 'VENDOR'" class="role-form">
        <h3>Datos del Vendor</h3>
        <input v-model="storeName" type="text" placeholder="Nombre de la Tienda" required />
        <input v-model="storeAddress" type="text" placeholder="Dirección Principal" required />
      </div>

      <button type="submit">Registrarse</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// 📚 Campos Comunes
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const errorMessage = ref('');

// 🚗 Campos Específicos de DRIVER
const phone = ref('');
const vehicleType = ref(''); 
const licensePlate = ref('');
const vehicleBrand = ref('');
const vehicleModel = ref('');
const driverLicense = ref('');

// 🏪 Campos Específicos de VENDOR
const storeName = ref('');
const storeAddress = ref('');

const router = useRouter();

// Función de validación numérica (permite + al inicio)
const isPhoneNumberValid = (number) => {
  const phoneRegex = /^\+?\d+$/;
  return phoneRegex.test(number);
};

const validateFields = () => {
  errorMessage.value = ''; // Limpiar mensaje de error
  
  // 1. Validar campos comunes
  if (!name.value || !email.value || !password.value || !role.value) {
    errorMessage.value = 'Debes completar el nombre, email, contraseña y seleccionar un rol.';
    return false;
  }

  // 2. Validar campos específicos del rol
  if (role.value === 'DRIVER') {
    // 🛑 VALIDACIÓN NUMÉRICA ESPECÍFICA PARA EL TELÉFONO
    if (phone.value && !isPhoneNumberValid(phone.value)) {
      errorMessage.value = 'El campo Teléfono solo puede contener números y opcionalmente el signo "+".';
      return false;
    }

    // Validar que el resto de campos obligatorios del Driver estén llenos
    if (!phone.value || !vehicleType.value || !licensePlate.value || !vehicleModel.value || !driverLicense.value) {
      errorMessage.value = 'Como Driver, debes completar todos los datos personales, del vehículo y la licencia.';
      return false;
    }
  } else if (role.value === 'VENDOR') {
    if (!storeName.value || !storeAddress.value) {
      errorMessage.value = 'Como Vendor, debes completar el nombre y la dirección de la tienda.';
      return false;
    }
  }
  
  return true;
};


const handleRegister = async () => {
  // 🛑 DETENER el registro si la validación falla
  if (!validateFields()) {
    console.warn('Registro detenido: Faltan campos obligatorios o son inválidos.');
    return;
  }
  
  // 📦 Construcción del objeto de datos (solo si la validación pasa)
  const userData = {
  name: name.value,
  email: email.value,
  password: password.value,
  role: role.value,
};

// ➕ Agregar campos específicos
if (role.value === 'DRIVER') {
  // Ajustar para coincidir con la estructura de driverProfile.DriverDto
  Object.assign(userData, {
    driverProfile: {
      DriverDto: { // Suponiendo que UpdateDriverDto tiene estas propiedades
        phone: phone.value,
        driverLicense: driverLicense.value,
        vehicleType: vehicleType.value,
        licensePlate: licensePlate.value,
        vehicleBrand: vehicleBrand.value,
        vehicleModel: vehicleModel.value,
      },
    },
  });
} else if (role.value === 'VENDOR') {
  // Ajustar para coincidir con la estructura de vendorProfile.VendorDto
  Object.assign(userData, {
    vendorProfile: {
      VendorDto: { // Coincide con CreateVendorDto (que usa shopName, no storeName/storeAddress)
        shopName: storeName.value, // ¡Asegúrate de usar 'shopName' y no 'storeName'!
        // Aquí no se incluye UserId porque el backend lo asignará.
      },
      // Si storeAddress es necesario, debe ir en el DTO apropiado (VendorDto o UserDto.address)
    },
  });
}

  console.log('Datos de registro a enviar:', userData);

  try {
    await axios.post('http://localhost:3000/auth/register', userData);
    router.replace('/login');
  } catch (err) {
    console.error('Error registering:', err.response?.data || err);
    errorMessage.value = err.response?.data?.message || 'No se pudo registrar. Verifica los datos.';
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem; /* Añadido padding para que el contenido no pegue al borde */
  border-radius: 10px; /* 🆕 Bordes redondeados para el formulario */
  border: 1px solid #ddd;
}

input, select {
  padding: 0.75rem; /* Aumentado padding para mejor touch/click */
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px; /* 🆕 Bordes redondeados para inputs y selects */
  transition: border-color 0.3s;
}

input:focus, select:focus {
    border-color: #42b883; /* Resalta el foco */
    outline: none;
}

.role-form {
  border: 1px dashed #42b883;
  padding: 1rem;
  margin-top: 0.5rem; /* Ajustado el margen superior */
  border-radius: 8px; /* 🆕 Bordes redondeados para el formulario condicional */
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #42b883;
}

button {
  padding: 0.75rem; /* Aumentado padding para mejor botón */
  font-size: 1.1rem; /* Ligeramente más grande */
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px; /* 🆕 Bordes redondeados para el botón */
  transition: background-color 0.3s, transform 0.1s;
}

button:hover {
  background-color: #369870;
}

button:active {
    transform: scale(0.99);
}

.error {
  color: #e53e3e; /* Color de error un poco más vivo */
  margin-top: 1rem;
  font-weight: bold;
}
</style>