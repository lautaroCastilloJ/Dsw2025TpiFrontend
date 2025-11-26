import { instance } from '../../shared/api/axiosInstance';
import { handleApiError } from '../../shared/helpers/errorMessages';

export const getOrderById = async (orderId) => {
  try {
    console.log('Fetching order by ID:', orderId);
    
    const response = await instance.get(`/api/orders/${orderId}`);

    console.log('Order details response:', response.data);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { 
      data: null, 
      error: handleApiError(error)
    };
  }
};
