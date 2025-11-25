# 📚 Guía de Manejo de Errores del Backend

## 🎯 Arquitectura

### Backend
Tu backend lanza excepciones personalizadas que son manejadas por un middleware global y devuelve errores en este formato:

**Respuesta del backend:**
```json
{
  "code": "PRODUCT_ALREADY_EXISTS",
  "message": "Ya existe un producto con InternalCode 'INT-2005'.",
  "status": 400,
  "traceId": "0HNHC01EFPDIP:00000009"
}
```

### Frontend
Archivo centralizado: `src/modules/shared/helpers/errorMessages.js`

**NO necesitas mapear códigos en el frontend**. El backend ya envía los mensajes listos para mostrar al usuario.

## 🔧 Cómo Usar en tus Componentes

### Uso en Servicios (Recomendado)
```javascript
import { handleApiError } from '../../shared/helpers/errorMessages';

export const myService = async (data) => {
  try {
    const response = await instance.post('/api/endpoint', data);
    return { data: response.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: handleApiError(error) // El mensaje viene del backend
    };
  }
};
```

### Uso en Componentes con SweetAlert2
```javascript
import { handleApiError } from '../../shared/helpers/errorMessages';

const { data, error } = await myService(formData);

if (error) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: error, // Mensaje directo del backend
    confirmButtonColor: '#3085d6',
  });
  return;
}

// Continuar con la lógica...
```

### Uso Alternativo (try-catch)
```javascript
import { handleApiError } from '../../shared/helpers/errorMessages';

try {
  await instance.post('/api/endpoint', data);
} catch (error) {
  const message = handleApiError(error);
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
  });
}
```

## 📋 Funciones Disponibles

### `handleApiError(error)`
Extrae el mensaje del backend o retorna un mensaje genérico según el tipo de error.

- ✅ **Errores del backend**: Retorna `error.response.data.message`
- ✅ **Errores de red**: Retorna "Error de conexión..."
- ✅ **Errores HTTP**: Retorna mensaje según el código de estado

### `getErrorDetails(error)`
Obtiene información completa del error para debugging:
```javascript
const details = getErrorDetails(error);
console.log(details);
// {
//   code: "PRODUCT_ALREADY_EXISTS",
//   message: "Ya existe un producto...",
//   status: 400,
//   traceId: "0HNHC01EFPDIP:00000009"
// }
```

## ✅ Servicios Ya Actualizados

- ✅ `auth/services/login.js`
- ✅ `auth/services/register.js`
- ✅ `products/services/create.js`
- ✅ `products/services/list.js`
- ✅ `orders/services/listServices.js`

## ✅ Componentes Ya Actualizados

- ✅ `LoginForm.jsx`
- ✅ `CreateProductForm.jsx`

## 🗑️ Archivos Obsoletos

Los siguientes archivos ya no son necesarios y pueden ser eliminados:

- `modules/auth/helpers/backendError.js`
- `modules/products/helpers/backendError.js`

## 💡 Ventajas de este Enfoque

✅ **Sin duplicación**: No hay que mantener mensajes en el frontend  
✅ **Sincronizado**: Los mensajes siempre son los del backend  
✅ **Multiidioma ready**: Si el backend cambia de idioma, el frontend también  
✅ **Consistente**: Todos los errores se manejan de la misma forma  
✅ **Debugging**: TraceId para rastrear errores en producción
