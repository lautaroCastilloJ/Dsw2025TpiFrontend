import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token);
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('role');
  });

  const [customerId, setCustomerId] = useState(() => {
    return localStorage.getItem('customerId');
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    setCustomerId(null);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    // Guardar token
    localStorage.setItem('token', data.token);
    setIsAuthenticated(true);

    // Guardar rol
    localStorage.setItem('role', data.role);
    setRole(data.role);

    // Guardar customerId solo si existe (rol Cliente)
    if (data.customerId) {
      localStorage.setItem('customerId', data.customerId);
      setCustomerId(data.customerId);
    } else {
      localStorage.removeItem('customerId');
      setCustomerId(null);
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        customerId,
        singin,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };