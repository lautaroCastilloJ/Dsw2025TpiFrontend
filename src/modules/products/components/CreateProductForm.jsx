import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {
    const { data, error } = await createProduct(formData);

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: error,
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Producto creado',
      text: 'El producto se ha creado exitosamente',
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate('/admin/products');
    }, 1500);
  };

  return (
    <Card>
      <form
        className='
          flex
          flex-col
          gap-20
          p-8

          sm:gap-4
        '
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
          })}
        />
        <Input
          label='Código Único'
          error={errors.cui?.message}
          {...register('cui', {
            required: 'Código Único es requerido',
          })}
        />
        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />
        <Input
          label='Descripción'
          {...register('description')}
        />
        <Input
          label='Precio'
          type='number'
          step='0.01'
          error={errors.price?.message}
          {...register('price', {
            required: 'Precio es requerido',
            valueAsNumber: true,
          })}
        />
        <Input
          label='Stock'
          type='number'
          error={errors.stock?.message}
          {...register('stock', {
            required: 'Stock es requerido',
            valueAsNumber: true,
          })}
        />
        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'>Crear Producto</Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateProductForm;
