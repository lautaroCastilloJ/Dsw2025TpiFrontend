import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/listServices';
import useAuth from '../../auth/hook/useAuth';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

const orderStatusLabels = {
  Pending: 'Pendiente',
  Processing: 'En Proceso',
  Shipped: 'Enviado',
  Delivered: 'Entregado',
  Cancelled: 'Cancelado',
};

function MyOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Redirigir si no está autenticado o si es administrador
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role === 'Administrador') {
      navigate('/admin/orders');
    }
  }, [isAuthenticated, role, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getMyOrders({
        status,
        pageNumber,
        pageSize,
      });

      if (error) {
        setError(error);
        return;
      }

      console.log('My orders response:', data);
      
      // Manejar respuesta paginada del backend
      if (data && Array.isArray(data.items)) {
        setOrders(data.items);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 0);
      } else if (Array.isArray(data)) {
        // Fallback si el backend devuelve array directo
        setOrders(data);
        setTotalCount(data.length);
        setTotalPages(1);
      } else {
        setOrders([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, pageNumber, pageSize]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-xl text-gray-600">Cargando órdenes...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
            <p className="text-xl text-red-600">{error}</p>
            <Button onClick={fetchOrders}>Reintentar</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className='text-4xl font-light text-gray-900 mb-2'>Mis Órdenes</h1>
        <p className="text-gray-600">Gestiona y revisa tus pedidos</p>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        <select 
          value={status || ''} 
          onChange={(e) => {
            setStatus(e.target.value || null);
            setPageNumber(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <option value="">Todos los estados</option>
          <option value="Pending">Pendiente</option>
          <option value="Processing">En Proceso</option>
          <option value="Shipped">Enviado</option>
          <option value="Delivered">Entregado</option>
          <option value="Cancelled">Cancelado</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-lg">No tienes órdenes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Orden #{order.id}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-500 text-white' :
                      order.status === 'Cancelled' ? 'bg-red-500 text-white' :
                      order.status === 'Shipped' ? 'bg-blue-500 text-white' :
                      order.status === 'Processing' ? 'bg-purple-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {orderStatusLabels[order.status] || order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-700">Fecha:</span> {formatDate(order.date)}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Total:</span> <span className="text-lg font-bold text-gray-900">${order.totalAmount?.toFixed(2)}</span>
                    </p>
                    {order.shippingAddress && (
                      <p>
                        <span className="font-medium text-gray-700">Dirección de envío:</span> {order.shippingAddress}
                      </p>
                    )}
                    {order.notes && (
                      <p className="mt-2 italic text-gray-500">
                        <span className="font-medium text-gray-700">Notas:</span> {order.notes}
                      </p>
                    )}
                    {order.items && order.items.length > 0 && (
                      <p className="text-gray-500 mt-2">
                        {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="px-6 py-2 rounded-lg font-medium whitespace-nowrap"
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium'
          >
            ← Anterior
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Página {pageNumber} de {totalPages}</span>
              <span className="text-gray-500">({totalCount} órdenes)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-gray-600 font-medium">
                Por página:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNumber(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          
          <button
            disabled={pageNumber === totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
            className='px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium'
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
