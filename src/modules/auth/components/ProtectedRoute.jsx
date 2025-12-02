import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, allowedRoles = [], allowGuests = false }) {
  const { isAuthenticated, role } = useAuth();

  // Si no está autenticado
  if (!isAuthenticated) {
    // Si se permiten invitados, dejar pasar
    if (allowGuests) {
      return children;
    }

    // Si no, redirigir a la página principal
    return <Navigate to='/' replace />;
  }

  // Si se especificaron roles permitidos y el usuario no tiene el rol adecuado
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to='/' replace />;
  }

  return children;
}

export default ProtectedRoute;
