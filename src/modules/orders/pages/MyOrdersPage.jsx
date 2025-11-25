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
  const [pageSize] = useState(10);

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

      console.log('Orders response:', data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data && Array.isArray(data.items)) {
        setOrders(data.items);
      } else if (data && typeof data === 'object') {
        // Si data es un objeto pero no tiene items, intentar convertirlo a array
        setOrders([]);
      } else {
        setOrders([]);
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
  }, [status, pageNumber]);

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
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl'>Mis Órdenes</h1>
        </div>

        <div className='mb-4'>
          <label className="mr-2">Filtrar por estado:</label>
          <select 
            value={status || ''} 
            onChange={(e) => {
              setStatus(e.target.value || null);
              setPageNumber(1);
            }}
            className="border rounded px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="Pending">Pendiente</option>
            <option value="Processing">En Proceso</option>
            <option value="Shipped">Enviado</option>
            <option value="Delivered">Entregado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No tienes órdenes aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Fecha</th>
                  <th className="border p-2 text-left">Estado</th>
                  <th className="border p-2 text-left">Dirección de Envío</th>
                  <th className="border p-2 text-right">Total</th>
                  <th className="border p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {orderStatusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="border p-2">{order.shippingAddress}</td>
                    <td className="border p-2 text-right">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="border p-2 text-center">
                      <Button 
                        className="text-sm px-3 py-1"
                        onClick={() => alert(`Ver detalles de orden ${order.id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default MyOrdersPage;
