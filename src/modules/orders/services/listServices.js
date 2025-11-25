import { instance } from '../../shared/api/axiosInstance';

// Para clientes: obtener sus propias órdenes
export const getMyOrders = async ({ 
  status = null,
  pageNumber = 1, 
  pageSize = 10 
} = {}) => {
  try {
    const params = {};
    
    if (status) {
      params.status = status;
    }
    
    params.pageNumber = pageNumber;
    params.pageSize = pageSize;

    console.log('Fetching my orders with params:', params);
    
    const response = await instance.get('/api/orders/my-orders', { params });

    console.log('My orders response:', response.data);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching my orders:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || error.message || 'Error al obtener órdenes' 
    };
  }
};

// Para administradores: obtener todas las órdenes con filtros
export const getOrdersAdmin = async ({ 
  status = null,
  customerId = null,
  pageNumber = 1, 
  pageSize = 10 
} = {}) => {
  try {
    const params = {
      ...(status && { status }),
      ...(customerId && { customerId }),
      pageNumber,
      pageSize,
    };

    const response = await instance.get('/api/orders/admin', { params });

    return { data: response.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al obtener órdenes' 
    };
  }
};

// Mantener retrocompatibilidad
export const listOrders = getOrdersAdmin;