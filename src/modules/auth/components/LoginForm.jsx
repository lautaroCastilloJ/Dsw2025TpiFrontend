import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { handleApiError } from '../../shared/helpers/errorMessages';

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { singin, role: userRole } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singin(formData.username, formData.password);

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: error,
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        // Obtener el rol del localStorage después del login
        const role = localStorage.getItem('role');
        
        // Redirigir según el rol
        if (role === 'Administrador') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (error) {
      const message = handleApiError(error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <form 
      className='flex flex-col gap-6 bg-white p-8 w-full max-w-md rounded-lg shadow-md border border-gray-200'
      onSubmit={handleSubmit(onValid)}
    >
      <div className='mb-2'>
        <h2 className='text-2xl font-bold text-gray-800'>Iniciar Sesión</h2>
        <p className='text-sm text-gray-600 mt-1'>Ingresa tus credenciales para continuar</p>
      </div>

      <Input
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
      />
      
      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatorio',
        }) }
        type='password'
        error={errors.password?.message}
      />

      <Button 
        type='submit' 
        className='w-full !bg-gray-800 hover:!bg-gray-700 !text-white font-semibold py-3 mt-2'
      >
        Iniciar Sesión
      </Button>
      
      <div className='flex flex-col gap-3 items-center pt-4 border-t border-gray-200'>
        <p className='text-gray-600 text-sm'>¿No tienes cuenta?</p>
        <Link to='/signup' className='w-full'>
          <Button 
            type='button' 
            className='w-full !bg-slate-600 hover:!bg-slate-700 !text-white font-medium'
          >
            Crear Cuenta
          </Button>
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
