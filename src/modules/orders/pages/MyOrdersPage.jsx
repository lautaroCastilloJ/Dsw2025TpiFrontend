import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/listServices';
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      <Card>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-xl text-gray-600">Cargando órdenes...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <p className="text-xl text-red-600">{error}</p>
          <Button onClick={fetchOrders}>Reintentar</Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <h1 className='text-3xl mb-4'>Mis Órdenes</h1>

        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <div className="flex items-center gap-2">
            <select 
              value={status || ''} 
              onChange={(e) => {
                setStatus(e.target.value || null);
                setPageNumber(1);
              }}
              className="border rounded px-4 py-2 bg-white"
            >
              <option value="">Estado de Orden</option>
              <option value="Pending">Pendiente</option>
              <option value="Processing">En Proceso</option>
              <option value="Shipped">Enviado</option>
              <option value="Delivered">Entregado</option>
              <option value="Cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No tienes órdenes aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold">
                        Orden #{order.id.substring(0, 8)}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {orderStatusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Fecha: {formatDate(order.date)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Total: ${order.totalAmount?.toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Envío: {order.shippingAddress}
                    </p>
                    {order.notes && (
                      <p className="text-gray-600 text-sm mt-1 italic">
                        Notas: {order.notes}
                      </p>
                    )}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-2 text-sm text-gray-500">
                        {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <Button 
                    className="text-sm px-4 py-2 bg-purple-200 hover:bg-purple-300 text-purple-800"
                    onClick={() => alert(`Ver detalles de orden ${order.id}`)}
                  >
                    Ver
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {!loading && orders.length > 0 && (
        <div className='flex flex-col sm:flex-row justify-center items-center gap-3 mt-4'>
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors'
          >
            ← Previous
          </button>
          
          <div className="flex items-center gap-2">
            {pageNumber > 2 && (
              <>
                <button
                  onClick={() => setPageNumber(1)}
                  className='px-3 py-2 rounded hover:bg-gray-200 transition-colors'
                >
                  1
                </button>
                {pageNumber > 3 && <span className="px-2">...</span>}
              </>
            )}
            
            {pageNumber > 1 && (
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                className='px-3 py-2 rounded hover:bg-gray-200 transition-colors'
              >
                {pageNumber - 1}
              </button>
            )}
            
            <button
              className='px-3 py-2 bg-purple-600 text-white rounded'
            >
              {pageNumber}
            </button>
            
            {pageNumber < totalPages && (
              <button
                onClick={() => setPageNumber(pageNumber + 1)}
                className='px-3 py-2 rounded hover:bg-gray-200 transition-colors'
              >
                {pageNumber + 1}
              </button>
            )}
            
            {pageNumber < totalPages - 1 && (
              <>
                {pageNumber < totalPages - 2 && <span className="px-2">3</span>}
                {pageNumber < totalPages - 2 && <span className="px-2">...</span>}
                <button
                  onClick={() => setPageNumber(totalPages)}
                  className='px-3 py-2 rounded hover:bg-gray-200 transition-colors'
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            disabled={pageNumber === totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors'
          >
            Next →
          </button>

          <select
            value={pageSize}
            onChange={evt => {
              setPageNumber(1);
              setPageSize(Number(evt.target.value));
            }}
            className='ml-3 px-3 py-2 border rounded bg-white'
          >
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="50">50 por página</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
