import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await instance.post('/api/auth/login', {
      username,
      password,
    });

    const { token, role, customerId } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);

    if (customerId) {
      localStorage.setItem('customerId', customerId);
    }

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Importar handleApiError si no está importado
    const { handleApiError } = await import('../../shared/helpers/errorMessages');

    return {
      data: null,
      error: handleApiError(error),
    };
  }
};