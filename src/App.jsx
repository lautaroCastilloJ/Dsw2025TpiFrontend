import { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { CartProvider } from './modules/cart/context/CartContext';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import AdminOrdersListPage from './modules/orders/pages/AdminOrdersListPage';
import OrderDetailPage from './modules/orders/pages/OrderDetailPage';
import AdminDashboardPage from './modules/home/pages/AdminDashboardPage';
import AdminProductsListPage from './modules/products/pages/AdminProductsListPage';
import AdminCreateProductPage from './modules/products/pages/AdminCreateProductPage';
import AdminEditProductPage from './modules/products/pages/AdminEditProductPage';
import PublicProductsPage from './modules/products/pages/PublicProductsPage';
import CartPage from './modules/cart/pages/CartPage';
import CustomerOrdersPage from './modules/orders/pages/CustomerOrdersPage';
import Header from './modules/shared/components/Header';
import Footer from './modules/shared/components/Footer';

// Layout para las páginas públicas (Cliente)
function PublicLayout() {
  const [headerSearch, setHeaderSearch] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={setHeaderSearch} searchTerm={headerSearch} />
      <main className="flex-grow">
        <Outlet context={{ headerSearch }} />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    // ========== RUTAS PÚBLICAS (CLIENTE) ==========
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          // Página principal - Listado de productos público
          path: '/',
          element: <PublicProductsPage />,
        },
        {
          // Carrito - Solo para clientes (no administradores)
          path: '/cart',
          element: (
            <ProtectedRoute allowedRoles={['Cliente']} allowGuests={true}>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          // Mis órdenes - Solo para clientes autenticados
          path: '/my-orders',
          element: (
            <ProtectedRoute>
              <CustomerOrdersPage />
            </ProtectedRoute>
          ),
        },
        {
          // Detalle de orden para cliente
          path: '/order/:orderId',
          element: (
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // ========== RUTAS DE AUTENTICACIÓN ==========
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <RegisterPage />,
    },

    // ========== RUTAS PROTEGIDAS DE ADMINISTRADOR ==========
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={['Administrador']}>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          // Dashboard principal con estadísticas
          index: true,
          element: <AdminDashboardPage />,
        },
        {
          // Gestión de productos
          path: 'products',
          element: <AdminProductsListPage />,
        },
        {
          path: 'products/create',
          element: <AdminCreateProductPage />,
        },
        {
          path: 'products/edit/:productId',
          element: <AdminEditProductPage />,
        },
        {
          // Gestión de órdenes
          path: 'orders',
          element: <AdminOrdersListPage />,
        },
        {
          path: 'orders/:orderId',
          element: <OrderDetailPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
