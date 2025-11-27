import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getProductById, updateProduct, toggleProductEnabled } from '../services/update';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Swal from 'sweetalert2';

function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [productStatus, setProductStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProductById(productId);

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        navigate('/admin/products');
        return;
      }

      // Cargar los datos del producto en el formulario
      reset({
        sku: data.sku,
        internalCode: data.internalCode,
        name: data.name,
        description: data.description,
        currentUnitPrice: data.currentUnitPrice,
        stockQuantity: data.stockQuantity,
      });

      // Guardar el estado del producto
      setProductStatus(data.isActive);
    } catch (err) {
      console.error('Error fetching product:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el producto',
      });
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);

    try {
      // Preparar los datos del producto sin isActive
      const productData = {
        sku: formData.sku.trim(),
        internalCode: formData.internalCode.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        currentUnitPrice: parseFloat(formData.currentUnitPrice),
        stockQuantity: parseInt(formData.stockQuantity),
      };

      console.log('Submitting product update:', productData);

      const { data, error } = await updateProduct(productId, productData);

      if (error) {
        // Mensaje más específico si el error contiene información sobre SKU o código duplicado
        const errorTitle = error.toLowerCase().includes('sku') || error.toLowerCase().includes('internalcode') || error.toLowerCase().includes('ya existe')
          ? 'SKU o Código Interno duplicado'
          : 'Error al actualizar producto';
        
        Swal.fire({
          icon: 'error',
          title: errorTitle,
          text: error,
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Producto actualizado',
        text: 'El producto se actualizó correctamente',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/admin/products');
    } catch (err) {
      console.error('Error updating product:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar el producto',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    setTogglingStatus(true);
    try {
      const { data, error } = await toggleProductEnabled(productId, productStatus);

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        return;
      }

      // Actualizar el estado local con la respuesta del servidor
      const newStatus = data.isActive;
      setProductStatus(newStatus);

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
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Editar Producto</h1>
          <Button
            onClick={() => navigate('/admin/products')}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Cancelar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <Input
                label="SKU"
                {...register('sku', {
                  required: 'El SKU es requerido',
                  minLength: {
                    value: 1,
                    message: 'El SKU debe tener al menos 1 carácter',
                  },
                  validate: (value) => {
                    if (!value.trim()) {
                      return 'El SKU no puede estar vacío';
                    }
                    return true;
                  },
                })}
                error={errors.sku?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ El SKU debe ser único en el sistema
              </p>
            </div>

            {/* Código Interno */}
            <div>
              <Input
                label="Código Interno"
                {...register('internalCode', {
                  required: 'El código interno es requerido',
                  minLength: {
                    value: 1,
                    message: 'El código interno debe tener al menos 1 carácter',
                  },
                  validate: (value) => {
                    if (!value.trim()) {
                      return 'El código interno no puede estar vacío';
                    }
                    return true;
                  },
                })}
                error={errors.internalCode?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ El código interno debe ser único en el sistema
              </p>
            </div>
          </div>

          {/* Nombre */}
          <Input
            label="Nombre del Producto"
            {...register('name', {
              required: 'El nombre es requerido',
              minLength: {
                value: 3,
                message: 'El nombre debe tener al menos 3 caracteres',
              },
              validate: (value) => {
                if (!value.trim()) {
                  return 'El nombre no puede estar vacío';
                }
                return true;
              },
            })}
            error={errors.name?.message}
          />

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register('description', {
                required: 'La descripción es requerida',
                minLength: {
                  value: 10,
                  message: 'La descripción debe tener al menos 10 caracteres',
                },
                validate: (value) => {
                  if (!value.trim()) {
                    return 'La descripción no puede estar vacía';
                  }
                  return true;
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="4"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Precio */}
            <Input
              label="Precio Unitario"
              type="number"
              step="0.01"
              {...register('currentUnitPrice', {
                required: 'El precio es requerido',
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: 'El precio debe ser mayor a 0',
                },
                validate: (value) => {
                  if (isNaN(value) || value <= 0) {
                    return 'El precio debe ser un número mayor a 0';
                  }
                  return true;
                },
              })}
              error={errors.currentUnitPrice?.message}
            />

            {/* Stock */}
            <Input
              label="Cantidad en Stock"
              type="number"
              {...register('stockQuantity', {
                required: 'El stock es requerido',
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'El stock no puede ser negativo',
                },
                validate: (value) => {
                  if (isNaN(value) || value < 0) {
                    return 'El stock debe ser un número mayor o igual a 0';
                  }
                  if (!Number.isInteger(value)) {
                    return 'El stock debe ser un número entero';
                  }
                  return true;
                },
              })}
              error={errors.stockQuantity?.message}
            />
          </div>

          {/* Estado del producto con información */}
          {productStatus !== null && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Estado del producto
              </p>
              <p className="text-sm text-gray-600">
                El producto está actualmente:{' '}
                <span className={`font-semibold ${productStatus ? 'text-green-600' : 'text-red-600'}`}>
                  {productStatus ? 'Activo' : 'Inactivo'}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Nota: Para activar o desactivar el producto, usa el botón correspondiente en la lista de productos.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>

            <Button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EditProductPage;
