import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from './Button';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, role, username, singout } = useAuth();

  const handleLogout = () => {
    singout();
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition">
            TPI Store
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-gray-300 transition">
              Productos
            </Link>
            
            {isAuthenticated ? (
              <>
                {role === 'Cliente' && (
                  <>
                    <Link to="/cart" className="hover:text-gray-300 transition">
                      Carrito
                    </Link>
                    <Link to="/customer/orders" className="hover:text-gray-300 transition">
                      Mis Órdenes
                    </Link>
                  </>
                )}
                
                {role === 'Administrador' && (
                  <Link to="/admin/home" className="hover:text-gray-300 transition">
                    Panel Admin
                  </Link>
                )}
                
                <div className="flex items-center gap-3 border-l border-gray-600 pl-6 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold">{username}</div>
                    <div className="text-xs text-gray-400">{role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300 transition">
                  Login
                </Link>
                <Link to="/register" className="hover:text-gray-300 transition">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
