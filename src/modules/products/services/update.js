import { instance } from '../../shared/api/axiosInstance';
import { handleApiError } from '../../shared/helpers/errorMessages';

export const updateProduct = async (productId, productData) => {
  try {
    console.log('Updating product:', { productId, productData });

    const response = await instance.put(`/api/products/${productId}`, productData);

    console.log('Product updated successfully:', response.data);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error updating product:', error);

    return {
      data: null,
      error: handleApiError(error),
    };
  }
};

export const toggleProductEnabled = async (productId, currentStatus) => {
  try {
    console.log('Toggling product enabled status:', productId, 'Current status:', currentStatus);

    // Llamar al endpoint correcto según el estado actual
    const endpoint = currentStatus
      ? `/api/products/${productId}/disable`
      : `/api/products/${productId}/enable`;

    const response = await instance.patch(endpoint);

    console.log('Product status toggled successfully:', response.data);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error toggling product status:', error);

    return {
      data: null,
      error: handleApiError(error),
    };
  }
};

export const getProductById = async (productId) => {
  try {
    console.log('Fetching product by ID:', productId);

    const response = await instance.get(`/api/products/${productId}`);

    console.log('Product details:', response.data);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching product:', error);

    return {
      data: null,
      error: handleApiError(error),
    };
  }
};
