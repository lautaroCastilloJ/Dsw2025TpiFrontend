import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getProductsPublic } from '../services/list';
import { useCart } from '../../cart/context/CartContext';
import useAuth from '../../auth/hook/useAuth';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Swal from 'sweetalert2';

function PublicProductsPage() {
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

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Si hay búsqueda, traer todos los resultados sin paginación
      const effectivePageSize = headerSearch ? 1000 : pageSize;
      const effectivePageNumber = headerSearch ? 1 : pageNumber;

      const { data, error } = await getProductsPublic({
        search: headerSearch || null,
        pageNumber: effectivePageNumber,
        pageSize: effectivePageSize,
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
  }, [pageNumber, pageSize, headerSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Título de la sección */}
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-2 sm:mb-4 text-gray-900 tracking-wide">Catálogo de Productos</h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
          Distribuidor oficial de Apple en Argentina.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {products.map((product) => {
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Imagen del producto */}
              {product.imageUrl && (
                <div className="w-full h-48 sm:h-56 md:h-64 bg-white flex items-center justify-center border-b">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 sm:p-3 md:p-4"
                    onError={(e) => {
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="p-3 sm:p-4 md:p-6">
                <h5 className="text-base sm:text-lg md:text-xl font-bold tracking-tight mb-1 sm:mb-2 text-gray-900">
                  {product.name}
                </h5>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Stock Badge */}
                <div className="mb-3">
                  {product.stockQuantity > 0 ? (
                    <span className="inline-flex items-center rounded-md border
                    border-transparent bg-green-500 text-white px-3 py-0.5 text-s font-semibold">
                      Stock ({product.stockQuantity})
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md border
                    border-transparent bg-red-500 text-white px-3 py-0.5 text-s font-semibold">
                      Sin Stock
                    </span>
                  )}
                </div>

                {/* Precio */}
                <div className="mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ${product.currentUnitPrice.toFixed(2)}
                  </span>
                </div>

                {/* Botón */}
                {(!isAuthenticated || role !== 'Administrador') && (
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg"
                    disabled={product.stockQuantity === 0}
                  >
                    {product.stockQuantity > 0 ? 'Agregar' : 'Sin Stock'}
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

      {/* Paginación - Solo mostrar si no hay búsqueda activa */}
      {!loading && products.length > 0 && !headerSearch && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            disabled={!hasPrevious}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='px-3 sm:px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300 text-sm sm:text-base'
          >
            Atrás
          </button>

          <span className='text-sm sm:text-base md:text-lg text-center'>
            Página {pageNumber} de {totalPages} ({totalCount} productos)
          </span>

          <button
            disabled={!hasNext}
            onClick={() => setPageNumber(pageNumber + 1)}
            className='px-3 sm:px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300 text-sm sm:text-base'
          >
            Siguiente
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNumber(1);
            }}
            className='px-2 sm:px-3 py-2 border rounded bg-white text-sm sm:text-base w-full sm:w-auto'
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={12}>12 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      )}

      {/* Mostrar contador de resultados cuando hay búsqueda activa */}
      {!loading && headerSearch && (
        <div className="text-center mt-6 sm:mt-8">
          <span className='text-sm sm:text-base md:text-lg text-gray-600'>
            {totalCount} {totalCount === 1 ? 'producto encontrado' : 'productos encontrados'}
          </span>
        </div>
      )}
    </div>
  );
}

export default PublicProductsPage;
