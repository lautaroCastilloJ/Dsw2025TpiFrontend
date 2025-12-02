import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProductsAdmin } from '../../products/services/list';
import { getOrdersAdmin } from '../../orders/services/listServices';

function AdminDashboardPage() {
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

      // Obtener total de productos
      const { data: allProductsData } = await getProductsAdmin({
        pageNumber: 1,
        pageSize: 1,
      });

      // Obtener productos activos
      const { data: activeProductsData } = await getProductsAdmin({
        status: 'enabled',
        pageNumber: 1,
        pageSize: 1,
      });

      // Obtener productos inactivos
      const { data: inactiveProductsData } = await getProductsAdmin({
        status: 'disabled',
        pageNumber: 1,
        pageSize: 1,
      });

      // Obtener órdenes (solo el total)
      const { data: ordersData } = await getOrdersAdmin({
        pageNumber: 1,
        pageSize: 1,
      });

      // Obtener órdenes por estado
      const { data: pendingOrders } = await getOrdersAdmin({
        status: 'Pending',
        pageNumber: 1,
        pageSize: 1,
      });

      const { data: processingOrders } = await getOrdersAdmin({
        status: 'Processing',
        pageNumber: 1,
        pageSize: 1,
      });

      const { data: shippedOrders } = await getOrdersAdmin({
        status: 'Shipped',
        pageNumber: 1,
        pageSize: 1,
      });

      const { data: deliveredOrders } = await getOrdersAdmin({
        status: 'Delivered',
        pageNumber: 1,
        pageSize: 1,
      });

      const { data: cancelledOrders } = await getOrdersAdmin({
        status: 'Cancelled',
        pageNumber: 1,
        pageSize: 1,
      });

      setStats({
        totalProducts: allProductsData?.totalCount || 0,
        activeProducts: activeProductsData?.totalCount || 0,
        inactiveProducts: inactiveProductsData?.totalCount || 0,
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
    <div className="space-y-8">
      <div className="border-b-2 border-gray-200 pb-4">
        <h1 className="text-4xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-600 mt-2 font-medium">Resumen general del sistema</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2 uppercase tracking-wide opacity-90">Total Órdenes</h3>
            <p className="text-6xl font-bold mb-3">{stats.totalOrders}</p>
            <p className="text-sm opacity-80 font-medium">Órdenes gestionadas en el sistema</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900 to-blue-950 text-white border-none shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2 uppercase tracking-wide opacity-90">Total Productos</h3>
            <p className="text-6xl font-bold mb-3">{stats.totalProducts}</p>
            <p className="text-sm opacity-80 font-medium">Productos en el catálogo</p>
          </div>
        </Card>
      </div>

      {/* Desglose de órdenes y productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-wide border-b-2 border-gray-200 pb-3">Estado de Órdenes</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-l-4 border-yellow-600">
              <span className="font-bold text-gray-800">Pendientes</span>
              <span className="text-2xl font-bold text-yellow-700">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-600">
              <span className="font-bold text-gray-800">En Proceso</span>
              <span className="text-2xl font-bold text-purple-700">{stats.processingOrders}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-600">
              <span className="font-bold text-gray-800">Enviadas</span>
              <span className="text-2xl font-bold text-blue-700">{stats.shippedOrders}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-600">
              <span className="font-bold text-gray-800">Entregadas</span>
              <span className="text-2xl font-bold text-green-700">{stats.deliveredOrders}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-600">
              <span className="font-bold text-gray-800">Canceladas</span>
              <span className="text-2xl font-bold text-red-700">{stats.cancelledOrders}</span>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-wide border-b-2 border-gray-200 pb-3">Gestión de Productos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-900">
              <span className="font-bold text-gray-800">Total de Productos</span>
              <span className="text-2xl font-bold text-blue-900">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-700">
              <span className="font-bold text-gray-800">Productos Activos</span>
              <span className="text-2xl font-bold text-green-700">{stats.activeProducts}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-gray-600">
              <span className="font-bold text-gray-800">Productos Inactivos</span>
              <span className="text-2xl font-bold text-gray-700">{stats.inactiveProducts}</span>
            </div>
          </div>
          <div className="mt-6 p-5 bg-slate-50 rounded-lg border-2 border-slate-200">
            <p className="text-sm text-gray-700 font-bold mb-3 uppercase tracking-wide">
              Información del Sistema
            </p>
            <ul className="text-sm text-gray-700 space-y-2 font-medium">
              <li className="flex items-start">
                <span className="text-blue-900 mr-2">•</span>
                <span>Administra el inventario desde la sección "Productos"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 mr-2">•</span>
                <span>Controla la visibilidad según disponibilidad</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 mr-2">•</span>
                <span>Los productos inactivos no aparecen en la tienda</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
