import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // Si se especificaron roles permitidos y el usuario no tiene el rol adecuado
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to='/' replace />;
  }

  return children;
}

export default ProtectedRoute;
