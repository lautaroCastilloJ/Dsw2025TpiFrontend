import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';

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

  return (
    <div>
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

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3'>
            <input 
              value={searchTerm} 
              onChange={(evt) => setSearchTerm(evt.target.value)}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter') handleSearch();
              }}
              type="text" 
              placeholder='Buscar por SKU o nombre' 
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
          <select 
            onChange={evt => {
              const value = evt.target.value;
              setStatus(value === 'null' ? null : value);  // ← Manejo de null
              setPageNumber(1);  // ← Reset a página 1 al cambiar filtro
            }} 
            className='text-[1.3rem]'
          >
            <option value="null">Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
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
                  className='text-sm'
                >
                  Editar
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