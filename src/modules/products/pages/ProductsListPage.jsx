import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getProductsPublic } from '../services/list';
import { useCart } from '../../cart/context/CartContext';
import useAuth from '../../auth/hook/useAuth';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Swal from 'sweetalert2';

function ProductsListPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, role } = useAuth();
  const { headerSearch = '' } = useOutletContext() || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getProductsPublic({
        search: headerSearch || null,
        pageNumber,
        pageSize,
      });

      if (error) {
        setError(error);
        return;
      }

      setProducts(data.items);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, pageSize, headerSearch]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado',
      text: `${product.name} fue agregado al carrito`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: 'top-start',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título de la sección */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-light mb-4 text-gray-900 tracking-wide">Catálogo de Productos</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Distribuidor oficial de Apple en Argentina.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.map((product) => {
          // Generar rating aleatorio entre 4.0 y 5.0 (simulado)
          const rating = (4 + Math.random()).toFixed(1);
          const reviews = Math.floor(50 + Math.random() * 300);
          const fullStars = Math.floor(parseFloat(rating));
          
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Imagen del producto */}
              {product.imageUrl && (
                <div className="w-full h-64 bg-white flex items-center justify-center border-b">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <h5 className="text-xl font-bold tracking-tight mb-2 text-gray-900">
                  {product.name}
                </h5>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Rating con estrellas */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(fullStars)].map((_, i) => (
                      <span key={`full-${i}`}>★</span>
                    ))}
                    {[...Array(5 - fullStars)].map((_, i) => (
                      <span key={`empty-${i}`} className="text-gray-300">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{rating} ({reviews} reviews)</span>
                </div>
                
                {/* Stock Badge */}
                <div className="mb-3">
                  {product.stockQuantity > 0 ? (
                    <span className="inline-flex items-center rounded-md border 
                    border-transparent bg-green-500 text-white px-2.5 py-0.5 text-xs font-semibold">
                      In Stock ({product.stockQuantity})
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md border 
                    border-transparent bg-red-500 text-white px-2.5 py-0.5 text-xs font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
                
                {/* Precio */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.currentUnitPrice.toFixed(2)}
                  </span>
                </div>
                
                {/* Botón */}
                {(!isAuthenticated || role !== 'Administrador') && (
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 text-base font-semibold rounded-lg"
                    disabled={product.stockQuantity === 0}
                  >
                    {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                )}
                
                {isAuthenticated && role === 'Administrador' && (
                  <div className="w-full text-center py-2 text-gray-500 text-sm">
                    Vista previa de la tienda
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No hay productos disponibles</p>
        </div>
      )}

      {/* Paginación */}
      {!loading && products.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={!hasPrevious}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300'
          >
            Atrás
          </button>
          
          <span className='text-lg'>
            Página {pageNumber} de {totalPages} ({totalCount} productos)
          </span>
          
          <button
            disabled={!hasNext}
            onClick={() => setPageNumber(pageNumber + 1)}
            className='px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300'
          >
            Siguiente
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNumber(1);
            }}
            className='px-3 py-2 border rounded bg-white'
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={12}>12 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default ProductsListPage;
