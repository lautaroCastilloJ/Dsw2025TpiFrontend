import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersAdmin } from '../services/listServices';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

const orderStatusLabels = {
  Pending: 'Pendiente',
  Processing: 'En Proceso',
  Shipped: 'Enviado',
  Delivered: 'Entregado',
  Cancelled: 'Cancelado',
};

function ListOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [status, setStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('search'); // 'search', 'customerId', 'customerName'
  
  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Preparar parámetros según el tipo de búsqueda
      const params = {
        status,
        pageNumber,
        pageSize,
      };

      if (searchTerm.trim()) {
        if (searchType === 'customerId') {
          params.customerId = searchTerm.trim();
        } else if (searchType === 'customerName') {
          params.customerName = searchTerm.trim();
        } else {
          // search general (busca en OrderId, CustomerName, Notes)
          params.search = searchTerm.trim();
        }
      }

      const { data, error } = await getOrdersAdmin(params);

      if (error) {
        setError(error);
        return;
      }

      console.log('Admin orders response:', data);
      
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

  const handleSearch = () => {
    setPageNumber(1);
    fetchOrders();
  };

  const handleClearFilters = () => {
    setStatus(null);
    setSearchTerm('');
    setSearchType('search');
    setPageNumber(1);
  };

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
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <h1 className='text-3xl mb-4'>Órdenes</h1>

        <div className='flex flex-col gap-4 mb-6'>
          {/* Fila 1: Búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border rounded px-4 py-2 bg-white"
            >
              <option value="search">Búsqueda General</option>
              <option value="customerId">ID Cliente</option>
              <option value="customerName">Nombre Cliente</option>
            </select>

            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                placeholder={
                  searchType === 'customerId' ? 'Buscar por ID de cliente...' :
                  searchType === 'customerName' ? 'Buscar por nombre de cliente...' :
                  'Buscar por ID orden, cliente o notas...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="border rounded px-4 py-2 flex-1 min-w-0"
              />
              <Button onClick={handleSearch} className="whitespace-nowrap">
                Buscar
              </Button>
            </div>
          </div>

          {/* Fila 2: Filtros y acciones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={status || ''} 
              onChange={(e) => {
                setStatus(e.target.value || null);
                setPageNumber(1);
              }}
              className="border rounded px-4 py-2 bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="Pending">Pendiente</option>
              <option value="Processing">En Proceso</option>
              <option value="Shipped">Enviado</option>
              <option value="Delivered">Entregado</option>
              <option value="Cancelled">Cancelado</option>
            </select>

            {(status || searchTerm) && (
              <Button 
                onClick={handleClearFilters}
                className="bg-gray-500 hover:bg-gray-600"
              >
                🗑️ Limpiar Filtros
              </Button>
            )}

            <div className="text-sm text-gray-600 flex items-center ml-auto">
              {totalCount > 0 && (
                <span>
                  Mostrando {orders.length} de {totalCount} órdenes
                </span>
              )}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {searchTerm || status ? 'No se encontraron órdenes con los filtros aplicados' : 'No hay órdenes para mostrar'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Cliente:</span> {order.customerName || order.customerFullName || 'Cliente Desconocido'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Fecha:</span> {formatDate(order.date)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Total:</span> ${order.totalAmount?.toFixed(2)}
                      </p>
                      {order.customerId && (
                        <p className="text-gray-600">
                          <span className="font-medium">ID Cliente:</span> {order.customerId.substring(0, 8)}...
                        </p>
                      )}
                      <p className="text-gray-600 md:col-span-2">
                        <span className="font-medium">Envío:</span> {order.shippingAddress}
                      </p>
                      {order.notes && (
                        <p className="text-gray-600 md:col-span-2 italic">
                          <span className="font-medium">Notas:</span> {order.notes}
                        </p>
                      )}
                      {order.items && order.items.length > 0 && (
                        <p className="text-gray-500 md:col-span-2">
                          {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="text-sm px-4 py-2 bg-purple-200 hover:bg-purple-300 text-purple-800 ml-4"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    Ver Detalle
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
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="50">50 por página</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default ListOrdersPage;
