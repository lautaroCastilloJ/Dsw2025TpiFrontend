import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';
import { toggleProductEnabled } from '../services/update';
import Swal from 'sweetalert2';

const productStatus = {
  ALL: null,  // ← Cambiado de 'all' a null
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalCount, setTotalCount] = useState(0);  // ← Renombrado
  const [totalPages, setTotalPages] = useState(0);  // ← Nuevo
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // ← Nuevo para manejar errores
  const [togglingId, setTogglingId] = useState(null);  // ← ID del producto que se está cambiando

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getProducts({
        search: searchTerm || null,
        status: status,
        pageNumber,
        pageSize,
      });

      if (error) {
        setError(error);
        return;
      }

      setTotalCount(data.totalCount);  // ← Cambiado
      setTotalPages(data.totalPages);   // ← Cambiado
      setProducts(data.items);          // ← Cambiado
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const handleSearch = async () => {
    setPageNumber(1);  // ← Reset a página 1 al buscar
    await fetchProducts();
  };

  const handleToggleProduct = async (productId, currentStatus) => {
    setTogglingId(productId);
    try {
      const { data, error } = await toggleProductEnabled(productId, currentStatus);

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        setTogglingId(null);
        return;
      }

      console.log('Toggle response:', data);

      // Actualizar el producto en la lista local con el nuevo estado
      const newStatus = data?.isActive !== undefined ? data.isActive : !currentStatus;
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? { ...p, isActive: newStatus } : p
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        text: `El producto se ${newStatus ? 'activó' : 'desactivó'} correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error toggling product status:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al cambiar el estado del producto',
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      {/* Título y botón de crear */}
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Productos</h1>
          <Button
            className='h-11 w-11 rounded-2xl sm:hidden'
            onClick={() => navigate('/admin/products/create')}
          >
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path>
                <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path>
              </g>
            </svg>
          </Button>

          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className='flex flex-col sm:flex-row gap-4 mb-3'>
          <select 
            onChange={evt => {
              const value = evt.target.value;
              setStatus(value === 'null' ? null : value);
              setPageNumber(1);
            }} 
            className='text-[1.3rem]'
          >
            <option value="null">Todos los estados</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>

          <div className='flex items-center gap-3 flex-1'>
            <input 
              value={searchTerm} 
              onChange={(evt) => setSearchTerm(evt.target.value)}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter') handleSearch();
              }}
              type="text" 
              placeholder='Buscar por SKU, nombre o descripción...' 
              className='text-[1.3rem] w-full' 
            />
            <Button className='h-11 w-11' onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </Button>
          </div>
          
          {/* Contador de productos */}
          {!loading && !error && (
            <div className="flex items-center text-gray-600 text-sm font-medium whitespace-nowrap">
              Mostrando {products.length} de {totalCount} productos
            </div>
          )}
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {loading && <span>Buscando datos...</span>}
        
        {error && <span className='text-red-500'>{error}</span>}
        
        {!loading && !error && products.length === 0 && (
          <Card>
            <p className='text-center text-gray-500'>No se encontraron productos</p>
          </Card>
        )}
        
        {!loading && !error && products.map(product => (
          <Card key={product.id}>  {/* ← Cambiado de product.sku a product.id */}
            <div className='flex justify-between items-start'>
              <div>
                <h1 className='text-xl font-semibold'>{product.sku} - {product.name}</h1>
                <p className='text-base mt-1'>
                  ${product.currentUnitPrice.toFixed(2)} - {' '}
                  <span className={product.isActive ? 'text-green-600' : 'text-red-600'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
              <div className='flex gap-2'>
                <Button 
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  className='text-sm !bg-blue-600 hover:!bg-blue-700 !text-white'
                >
                  Editar
                </Button>
                <Button 
                  onClick={() => handleToggleProduct(product.id, product.isActive)}
                  disabled={togglingId === product.id}
                  className={`text-sm !text-white ${
                    product.isActive 
                      ? '!bg-red-600 hover:!bg-red-700' 
                      : '!bg-green-600 hover:!bg-green-700'
                  }`}
                >
                  {togglingId === product.id ? '...' : (product.isActive ? 'Desactivar' : 'Activar')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!loading && products.length > 0 && (
        <div className='flex justify-center items-center gap-3 mt-4'>
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed'
          >
            Atrás
          </button>
          
          <span className='text-lg'>
            Página {pageNumber} de {totalPages} ({totalCount} productos)
          </span>
          
          <button
            disabled={pageNumber === totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
            className='px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed'
          >
            Siguiente
          </button>

          <select
            value={pageSize}
            onChange={evt => {
              setPageNumber(1);
              setPageSize(Number(evt.target.value));
            }}
            className='ml-3 px-3 py-2 border rounded'
          >
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="50">50 por página</option>
            <option value="100">100 por página</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default ListProductsPage;