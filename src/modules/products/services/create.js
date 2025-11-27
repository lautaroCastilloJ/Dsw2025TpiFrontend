import { instance } from '../../shared/api/axiosInstance';
import { handleApiError } from '../../shared/helpers/errorMessages';

export const createProduct = async (formData) => {
  try {
    const response = await instance.post('/api/products', {
      sku: formData.sku,
      internalCode: formData.cui,
      name: formData.name,
      description: formData.description,
      currentUnitPrice: formData.price,
      stockQuantity: formData.stock,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error)
    };
  }
};