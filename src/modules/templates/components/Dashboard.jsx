import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';

function Dashboard() {
  const navigate = useNavigate();

  const { singout, username } = useAuth();

  const logout = () => {
    singout();
    navigate('/login');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block  pt-4 pb-4 rounded-4xl transition hover:bg-gray-100
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Superior */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-lg sm:text-xl lg:text-2xl font-bold hover:text-gray-300 transition cursor-pointer"
            >
              <span className="hidden sm:inline">TPI Store - Admin</span>
              <span className="sm:hidden">Admin</span>
            </button>
            
            <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <button
                onClick={() => navigate('/')}
                className="hover:text-gray-300 transition text-xs sm:text-sm lg:text-base"
              >
                <span className="hidden sm:inline">Ver Tienda</span>
                <span className="sm:hidden">🏪</span>
              </button>
              
              <div className="flex items-center gap-2 lg:gap-3 border-l border-gray-600 pl-2 sm:pl-4 lg:pl-6 ml-2 sm:ml-4">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold">{username}</div>
                  <div className="text-xs text-gray-400">Administrador</div>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 lg:px-4 py-2 rounded transition-colors"
                >
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                  <span className="sm:hidden">Salir</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido con Sidebar */}
      <div className="flex-grow flex">
    <div
      className="
        h-full
        w-full
        grid
        grid-cols-1

        sm:gap-3
        sm:grid-cols-[256px_1fr]
      "
    >
      <aside
        className={`
          bg-white
          w-64
          p-6
          rounded
          shadow
          hidden

          sm:block
        `}
      >
        <nav>
          <ul
            className='flex flex-col gap-2'
          >
            <li>
              <NavLink
                to='/admin'
                end
                className={getLinkStyles}
              >Principal</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              >Productos</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              >Órdenes</NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main
        className="
          p-5
          overflow-y-scroll
        "
      >
        <Outlet />
      </main>
    </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">TPI Store - Panel de Administración</p>
              <p className="text-sm text-gray-400">Gestión completa de la tienda</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} TPI Store. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
