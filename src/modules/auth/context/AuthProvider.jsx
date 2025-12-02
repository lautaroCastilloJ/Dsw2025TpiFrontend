import { createContext, useState, useEffect } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    // Validar que el token exista y tenga contenido válido
    if (!token || token === 'undefined' || token === 'null') {
      localStorage.clear();

      return false;
    }

    return Boolean(token);
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('role');
  });

  const [customerId, setCustomerId] = useState(() => {
    return localStorage.getItem('customerId');
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username');
  });

  // Validar sesión al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');

    // Si falta algún dato crítico, limpiar todo
    if (token && (!storedRole || !storedUsername)) {
      localStorage.clear();
      setIsAuthenticated(false);
      setRole(null);
      setCustomerId(null);
      setUsername(null);
    }
  }, []);

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    setCustomerId(null);
    setUsername(null);
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

    // Guardar username
    if (data.username) {
      localStorage.setItem('username', data.username);
      setUsername(data.username);
    } else {
      localStorage.setItem('username', username);
      setUsername(username);
    }

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
        username,
        singin,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };