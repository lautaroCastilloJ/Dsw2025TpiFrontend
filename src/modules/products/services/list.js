import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async ({ 
  search = null, 
  status = null, 
  pageNumber = 1, 
  pageSize = 20 
} = {}) => {
  try {
    const params = {
      ...(search && { Search: search }),
      ...(status && { Status: status }),
      PageNumber: pageNumber,
      PageSize: pageSize,
    };

    const response = await instance.get('api/products/admin', { params });

    return { data: response.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al obtener productos' 
    };
  }
};