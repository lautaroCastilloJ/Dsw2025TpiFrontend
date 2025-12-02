import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hook/useAuth';
import { handleApiError } from '../../shared/helpers/errorMessages';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Swal from 'sweetalert2';

function LoginModal({ isOpen, onClose, onSwitchToRegister, requireClientRole = false }) {
  const { singin } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await singin(data.username, data.password);

      // Si se requiere que sea cliente, validar el rol
      if (requireClientRole) {
        const role = localStorage.getItem('role');

        if (role !== 'Cliente') {
          // Si no es cliente, cerrar sesión y mostrar error
          localStorage.clear();
          Swal.fire({
            icon: 'warning',
            title: 'Acceso Restringido',
            text: 'Solo los clientes pueden realizar compras. Los administradores deben usar el panel de administración.',
          });
          setLoading(false);

          return;
        }
      }

      onClose();
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Sesión iniciada correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              {...register('username', {
                required: 'El usuario es requerido',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu usuario"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password', {
                required: 'La contraseña es requerida',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu contraseña"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
