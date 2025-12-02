import { instance } from '../../shared/api/axiosInstance';
import { handleApiError } from '../../shared/helpers/errorMessages';

export const createOrder = async (orderData) => {
  try {
    console.log('Creating order with data:', orderData);

    const response = await instance.post('/api/orders', orderData);

    console.log('Order created successfully:', response.data);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error creating order:', error);

    return {
      data: null,
      error: handleApiError(error),
    };
  }
};
