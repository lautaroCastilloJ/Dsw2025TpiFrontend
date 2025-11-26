import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { CartProvider } from './modules/cart/context/CartContext';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import MyOrdersPage from './modules/orders/pages/MyOrdersPage';
import OrderDetailPage from './modules/orders/pages/OrderDetailPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import ProductsListPage from './modules/products/pages/ProductsListPage';
import CartPage from './modules/cart/pages/CartPage';
import CheckoutPage from './modules/cart/pages/CheckoutPage';
import Header from './modules/shared/components/Header';
import Footer from './modules/shared/components/Footer';

// Layout para las páginas públicas
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          path: '/',
          element: <ProductsListPage />,
        },
        {
          path: '/cart',
          element: <CartPage />,
        },
        {
          path: '/checkout',
          element: (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/customer/orders',
          element: (
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/order/:orderId',
          element: (
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin/home',
          element: <Home />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrdersPage />,
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
