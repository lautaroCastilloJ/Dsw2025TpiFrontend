import { instance } from '../../shared/api/axiosInstance';
import { handleApiError } from '../../shared/helpers/errorMessages';

// Para administradores: obtiene todos los productos con filtros
export const getProductsAdmin = async ({
  search = null,
  status = null,
  pageNumber = 1,
  pageSize = 20,
} = {}) => {
  try {
    const params = {};

    if (search) params.Search = search;

    if (status) params.Status = status;

    if (pageNumber) params.PageNumber = pageNumber;

    if (pageSize) params.PageSize = pageSize;

    const response = await instance.get('api/products/admin', { params });

    return { data: response.data, error: null };
  } catch (error) {
    // Si no hay productos (404 o 400), devolver estructura vacía válida
    if (error.response?.status === 400 || error.response?.status === 404) {
      return {
        data: { items: [], totalCount: 0, totalPages: 0, hasNext: false, hasPrevious: false },
        error: null,
      };
    }

    return {
      data: null,
      error: error.response?.data?.message || 'Error al obtener productos',
    };
  }
};

// Para usuarios públicos: obtiene solo productos activos
export const getProductsPublic = async ({
  search = null,
  pageNumber = 1,
  pageSize = 10,
} = {}) => {
  try {
    const params = {
      ...(search && { search: search }),
      pageNumber,
      pageSize,
    };

    const response = await instance.get('api/products', { params });

    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
    };
  }
};

// Mantener retrocompatibilidad con el nombre anterior
export const getProducts = getProductsAdmin;