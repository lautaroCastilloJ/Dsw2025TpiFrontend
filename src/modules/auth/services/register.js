import { instance } from '../../shared/api/axiosInstance';

export const register = async (userData) => {
  try {
    const response = await instance.post('/api/auth/register', {
      userName: userData.userName,
      password: userData.password,
      email: userData.email,
      displayName: userData.displayName,
      phoneNumber: userData.phoneNumber,
      role: userData.role || 'Cliente', // Rol por defecto
    });
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Register error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al registrar usuario' 
    };
  }
};
