import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsPublic } from '../services/list';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function ProductsListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getProductsPublic({
        pageNumber,
        pageSize: 12,
      });

      if (error) {
        setError(error);
        return;
      }

      setProducts(data.items);
      setTotalPages(data.totalPages);
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
  }, [pageNumber]);

  const handleAddToCart = (product) => {
    console.log('Agregar al carrito:', product);
    // Aquí implementarías la lógica del carrito
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
      <h1 className="text-4xl font-bold mb-8 text-center">Nuestros Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <div className="p-4 flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">SKU: {product.sku}</p>
              <p className="text-gray-700 mb-4 flex-grow">{product.description}</p>
              
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.currentUnitPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stockQuantity}
                  </span>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full"
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No hay productos disponibles</p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled={!hasPrevious}
            className="px-4 py-2"
          >
            Anterior
          </Button>
          
          <span className="text-gray-700">
            Página {pageNumber} de {totalPages}
          </span>
          
          <Button
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={!hasNext}
            className="px-4 py-2"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductsListPage;
