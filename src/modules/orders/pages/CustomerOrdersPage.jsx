import { useEffect, useState, useCallback, useRef } from 'react';
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

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'Pending', label: 'Pendiente' },
  { value: 'Processing', label: 'En Proceso' },
  { value: 'Shipped', label: 'Enviado' },
  { value: 'Delivered', label: 'Entregado' },
  { value: 'Cancelled', label: 'Cancelado' },
];

function CustomerOrdersPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Redirigir si es administrador
  useEffect(() => {
    if (role === 'Administrador') {
      navigate('/admin/orders');
    }
  }, [role, navigate]);

  const fetchOrders = useCallback(async () => {
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
  }, [status, pageNumber, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus || null);
    setPageNumber(1);
    setIsDropdownOpen(false);
  };

  const getSelectedLabel = () => {
    const selected = statusOptions.find(opt => opt.value === (status || ''));

    return selected ? selected.label : 'Todos los estados';
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
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2'>Mis Órdenes</h1>
        <p className="text-sm sm:text-base text-gray-600">Gestiona y revisa tus pedidos</p>
      </div>

      <div className='mb-6 sm:mb-8 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200'>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por estado:
        </label>
        <div ref={dropdownRef} className="relative w-full sm:max-w-xs">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            <span className="text-gray-700">{getSelectedLabel()}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {statusOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full text-left px-3 py-2.5 text-sm sm:text-base hover:bg-gray-100 transition-colors ${
                      (status || '') === option.value ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-lg">No tienes órdenes</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Orden #{order.id}
                    </h2>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
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
                      <span className="font-medium text-gray-700">Total:</span> <span className="text-base sm:text-lg font-bold text-gray-900">${order.totalAmount?.toFixed(2)}</span>
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
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap"
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
        <div className='flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4'>
          {/* Info y selector en mobile */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base text-gray-700 text-center sm:text-left">
              <span className="font-medium">Página {pageNumber} de {totalPages}</span>
              <span className="text-gray-500">({totalCount} órdenes)</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <label htmlFor="pageSize" className="text-xs sm:text-sm text-gray-600 font-medium">
                Por página:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNumber(1);
                }}
                className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex gap-2 sm:gap-3">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              className='flex-1 px-4 sm:px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base'
            >
              ← Anterior
            </button>

            <button
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
              className='flex-1 px-4 sm:px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base'
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerOrdersPage;
