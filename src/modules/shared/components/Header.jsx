import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import useAuth from '../../auth/hook/useAuth';
import { useCart } from '../../cart/context/CartContext';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';
import CartModal from '../../cart/components/CartModal';
import { ShoppingCart, Search, Menu, X, ShoppingCartIcon } from 'lucide-react';

function Header({ onSearch, searchTerm = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, username, singout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    singout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(localSearchTerm);
    }
  };

  const handleHomeClick = () => {
    setLocalSearchTerm('');

    if (onSearch) {
      onSearch('');
    }

    navigate('/');
  };

  return (
    <>
      <header className={`shadow-md sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white'
        }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4">
            {/* Logo */}
            <button
              onClick={handleHomeClick}
              className="text-3xl font-stretch-90% text-gray-900 hover:text-gray-700 transition cursor-pointer"
            >
              Home
            </button>

            {/* Barra de búsqueda - Desktop (oculta en páginas de órdenes) */}
            {!location.pathname.includes('/my-orders') && !location.pathname.includes('/order/') && (
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </form>
            )}

            {/* Acciones móviles - Carrito + Menú */}
            <div className="md:hidden flex items-center gap-3">
              {/* Carrito móvil */}
              {(!isAuthenticated || role === 'Cliente') && (
                <button
                  onClick={() => setShowCartModal(true)}
                  className="relative p-2"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[11px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              )}

              {/* Botón hamburguesa */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Menú desktop */}
            <nav className="hidden md:flex items-center gap-4">
              {/* Carrito */}
              {(!isAuthenticated || role === 'Cliente') && (
                <button
                  onClick={() => setShowCartModal(true)}
                  className="relative p-2"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[11px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <>
                  {role === 'Cliente' && (
                    <Link to="/my-orders" className="text-gray-700 hover:text-gray-900 transition text-sm font-medium">
                      Mis Órdenes
                    </Link>
                  )}

                  {role === 'Administrador' && (
                    <Link to="/admin" className="text-gray-700 hover:text-gray-900 transition text-sm font-medium">
                      Panel Admin
                    </Link>
                  )}

                  <div className="flex items-center gap-3 border-l border-gray-300 pl-4 ml-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{username}</div>
                      <div className="text-xs text-gray-500">{role}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ml-4"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Iniciar Sesión
                </button>
              )}
            </nav>
          </div>

          {/* Barra de búsqueda - Mobile */}
          {mobileMenuOpen && (
            <form onSubmit={handleSearch} className="md:hidden mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>
          )}

          {/* Menú móvil */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    {role === 'Cliente' && (
                      <Link
                        to="/my-orders"
                        className="text-gray-700 hover:text-gray-900 transition py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Mis Órdenes
                      </Link>
                    )}

                    {role === 'Administrador' && (
                      <Link
                        to="/admin"
                        className="text-gray-700 hover:text-gray-900 transition py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Panel Admin
                      </Link>
                    )}

                    <div className="border-t border-gray-200 pt-3 mt-2">
                      <div className="text-sm font-semibold text-gray-900 mb-1">{username}</div>
                      <div className="text-xs text-gray-500 mb-3">{role}</div>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {createPortal(
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />,
        document.body,
      )}

      {createPortal(
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />,
        document.body,
      )}

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  );
}

export default Header;