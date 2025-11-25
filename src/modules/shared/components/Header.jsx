import { Link } from 'react-router-dom';

function Header() {
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
            <Link to="/cart" className="hover:text-gray-300 transition">
              Carrito
            </Link>
            <Link to="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
