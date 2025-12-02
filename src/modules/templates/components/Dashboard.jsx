import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import { Menu, X } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const { singout, username } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector('.admin-main-content');

    const handleScroll = () => {
      if (mainElement && mainElement.scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);

      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const logout = () => {
    singout();
    navigate('/');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block pt-4 pb-4 rounded-lg transition-all duration-200
      ${isActive
      ? 'bg-slate-700 text-white font-semibold hover:bg-slate-600'
      : 'text-gray-700 hover:bg-slate-700 hover:text-white font-medium'
    }
    `
  );

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Superior */}
      <header className={`sticky top-0 z-40 text-white shadow-md transition-all duration-300 ${
        isScrolled ? 'bg-gray-800/90 backdrop-blur-md' : 'bg-gray-800'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Hamburger Menu Button - Only visible on mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden text-white hover:text-gray-300 transition"
                aria-label="Menú"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Panel Admin
              </h1>
            </div>

            <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <button
                onClick={() => navigate('/')}
                className="hover:text-gray-300 transition text-xs sm:text-sm lg:text-base"
              >
                <span className="hidden sm:inline">Ver Tienda</span>
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed left-0 top-[72px] bottom-0 w-64 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-6">
              <ul className='flex flex-col gap-2'>
                <li>
                  <NavLink
                    to='/admin'
                    end
                    className={getLinkStyles}
                    onClick={handleLinkClick}
                  >Principal</NavLink>
                </li>
                <li>
                  <NavLink
                    to='/admin/products'
                    className={getLinkStyles}
                    onClick={handleLinkClick}
                  >Productos</NavLink>
                </li>
                <li>
                  <NavLink
                    to='/admin/orders'
                    className={getLinkStyles}
                    onClick={handleLinkClick}
                  >Órdenes</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Contenido con Sidebar */}
      <div className="flex-grow flex">
        <div className="h-full w-full grid grid-cols-1 sm:gap-3 sm:grid-cols-[256px_1fr]">
          <aside className="bg-white w-64 p-6 rounded shadow hidden sm:block">
            <nav>
              <ul className='flex flex-col gap-2'>
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
          <main className="admin-main-content p-5 overflow-y-scroll">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">TPI - Panel de Administración</p>
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
