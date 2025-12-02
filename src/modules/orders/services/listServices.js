import { instance } from '../../shared/api/axiosInstance';
import { handleApiError } from '../../shared/helpers/errorMessages';

// Para clientes: obtener sus propias órdenes
export const getMyOrders = async ({
  status = null,
  pageNumber = 1,
  pageSize = 10,
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
      error: handleApiError(error),
    };
  }
};

// Para administradores: obtener todas las órdenes con filtros
export const getOrdersAdmin = async ({
  status = null,
  orderId = null,
  customerId = null,
  customerName = null,
  search = null,
  pageNumber = 1,
  pageSize = 10,
} = {}) => {
  try {
    const params = {
      pageNumber,
      pageSize,
    };

    if (status) {
      params.status = status;
    }

    if (orderId) {
      params.orderId = orderId;
    }

    if (customerId) {
      params.customerId = customerId;
    }

    if (customerName) {
      params.customerName = customerName;
    }

    if (search) {
      params.search = search;
    }

    const response = await instance.get('/api/orders/admin', { params });

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching admin orders:', error);

    return {
      data: null,
      error: handleApiError(error),
    };
  }
};

// Mantener retrocompatibilidad
export const listOrders = getOrdersAdmin;

// Actualizar estado de una orden
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await instance.patch(`/api/orders/${orderId}/status`, {
      newStatus,
    });

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);

    return {
      data: null,
      error: handleApiError(error),
    };
  }
};