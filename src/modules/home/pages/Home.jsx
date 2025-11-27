import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProductsAdmin } from '../../products/services/list';
import { getOrdersAdmin } from '../../orders/services/listServices';

function Home() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Obtener todos los productos
      const { data: productsData } = await getProductsAdmin({ 
        pageNumber: 1, 
        pageSize: 1 
      });

      // Obtener productos activos
      const { data: activeProducts } = await getProductsAdmin({ 
        status: 'true',
        pageNumber: 1, 
        pageSize: 1 
      });

      // Obtener productos inactivos
      const { data: inactiveProducts } = await getProductsAdmin({ 
        status: 'false',
        pageNumber: 1, 
        pageSize: 1 
      });

      // Obtener órdenes (solo el total)
      const { data: ordersData } = await getOrdersAdmin({ 
        pageNumber: 1, 
        pageSize: 1 
      });

      // Obtener órdenes por estado
      const { data: pendingOrders } = await getOrdersAdmin({ 
        status: 'Pending',
        pageNumber: 1, 
        pageSize: 1 
      });

      const { data: processingOrders } = await getOrdersAdmin({ 
        status: 'Processing',
        pageNumber: 1, 
        pageSize: 1 
      });

      const { data: shippedOrders } = await getOrdersAdmin({ 
        status: 'Shipped',
        pageNumber: 1, 
        pageSize: 1 
      });

      const { data: deliveredOrders } = await getOrdersAdmin({ 
        status: 'Delivered',
        pageNumber: 1, 
        pageSize: 1 
      });

      const { data: cancelledOrders } = await getOrdersAdmin({ 
        status: 'Cancelled',
        pageNumber: 1, 
        pageSize: 1 
      });

      setStats({
        totalProducts: productsData?.totalCount || 0,
        activeProducts: activeProducts?.totalCount || 0,
        inactiveProducts: inactiveProducts?.totalCount || 0,
        totalOrders: ordersData?.totalCount || 0,
        pendingOrders: pendingOrders?.totalCount || 0,
        processingOrders: processingOrders?.totalCount || 0,
        shippedOrders: shippedOrders?.totalCount || 0,
        deliveredOrders: deliveredOrders?.totalCount || 0,
        cancelledOrders: cancelledOrders?.totalCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-gray-600">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Estadísticas principales - Órdenes a la izquierda, Productos a la derecha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold mb-3">Total Órdenes</h3>
            <p className="text-5xl font-bold mb-4">{stats.totalOrders}</p>
            <p className="text-sm opacity-90">Órdenes realizadas en total</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold mb-3">Total Productos</h3>
            <p className="text-5xl font-bold mb-4">{stats.totalProducts}</p>
            <p className="text-sm opacity-90">Productos registrados en el sistema</p>
          </div>
        </Card>
      </div>

      {/* Desglose de órdenes por estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Estado de Órdenes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <span className="font-medium text-gray-700">⏳ Pendientes</span>
              <span className="text-xl font-bold text-yellow-600">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="font-medium text-gray-700">📦 En Proceso</span>
              <span className="text-xl font-bold text-purple-600">{stats.processingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="font-medium text-gray-700">🚚 Enviadas</span>
              <span className="text-xl font-bold text-blue-600">{stats.shippedOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="font-medium text-gray-700">✓ Entregadas</span>
              <span className="text-xl font-bold text-green-600">{stats.deliveredOrders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <span className="font-medium text-gray-700">✗ Canceladas</span>
              <span className="text-xl font-bold text-red-600">{stats.cancelledOrders}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Información de Productos</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="font-medium text-gray-700">📊 Total de Productos</span>
              <span className="text-xl font-bold text-blue-600">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="font-medium text-gray-700">✓ Productos Activos</span>
              <span className="text-xl font-bold text-green-600">{stats.activeProducts}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">✗ Productos Inactivos</span>
              <span className="text-xl font-bold text-gray-600">{stats.inactiveProducts}</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Resumen:</span>
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Gestiona tus productos desde la sección "Productos"</li>
              <li>• Activa o desactiva productos según disponibilidad</li>
              <li>• Los productos inactivos no son visibles para los clientes</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
