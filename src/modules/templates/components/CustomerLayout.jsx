import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function CustomerLayout() {
  const navigate = useNavigate();
  const { singout } = useAuth();

  const handleLogout = () => {
    singout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Portal del Cliente</h1>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              Productos
            </button>
            <button
              onClick={() => navigate('/customer/orders')}
              className="text-gray-600 hover:text-gray-800"
            >
              Mis Órdenes
            </button>
            <Button onClick={handleLogout} variant="secondary">
              Cerrar Sesión
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
