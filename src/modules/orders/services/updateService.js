import { instance } from '../../shared/api/axiosInstance';
import { handleApiError } from '../../shared/helpers/errorMessages';

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log('Updating order status:', { orderId, newStatus });
    
    const response = await instance.put(`/api/orders/${orderId}/status`, {
      newStatus
    });

    console.log('Order status updated successfully:', response.data);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { 
      data: null, 
      error: handleApiError(error)
    };
  }
};
