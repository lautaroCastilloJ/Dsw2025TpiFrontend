import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register } from '../services/register';

function RegisterForm() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      userName: '',
      password: '',
      confirmPassword: '',
      email: '',
      displayName: '',
      phoneNumber: '',
      role: '',
    },
  });

  const navigate = useNavigate();
  const password = watch('password');

  const onValid = async (formData) => {
    try {
      const { data, error } = await register({
        userName: formData.userName,
        password: formData.password,
        email: formData.email,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error,
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      // console.log('Usuario registrado exitosamente:', data);

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error inesperado. Por favor intenta nuevamente.',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <form
      className='
        flex
        flex-col
        gap-4
        bg-white
        p-8
        w-full
        max-w-md
        sm:rounded-lg
        sm:shadow-lg
      '
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className="text-2xl font-bold text-center mb-4">Crear Cuenta</h2>

      <Input
        label='Usuario'
        {...registerField('userName', {
          required: 'Usuario es obligatorio',
          minLength: {
            value: 3,
            message: 'Usuario debe tener al menos 3 caracteres',
          },
        })}
        error={errors.userName?.message}
      />

      <Input
        label='Email'
        type='email'
        {...registerField('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido',
          },
        })}
        error={errors.email?.message}
      />

      <Input
        label='Nombre completo'
        {...registerField('displayName', {
          required: 'Nombre es obligatorio',
        })}
        error={errors.displayName?.message}
      />

      <Input
        label='Teléfono'
        type='tel'
        {...registerField('phoneNumber', {
          required: 'Teléfono es obligatorio',
        })}
        error={errors.phoneNumber?.message}
      />

      <Input
        label='Contraseña'
        type='password'
        {...registerField('password', {
          required: 'Contraseña es obligatoria',
          minLength: {
            value: 6,
            message: 'Contraseña debe tener al menos 6 caracteres',
          },
        })}
        error={errors.password?.message}
      />

      <Input
        label='Confirmar Contraseña'
        type='password'
        {...registerField('confirmPassword', {
          required: 'Confirmar contraseña es obligatorio',
          validate: (value) =>
            value === password || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol
        </label>
        <select
          {...registerField('role', {
            required: 'Rol es obligatorio',
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar rol...</option>
          <option value="Cliente">Cliente</option>
          <option value="Administrador">Administrador</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      <Button type='submit' className="mt-4">Registrarse</Button>
      
      <Button
        type='button'
        variant='secondary'
        onClick={() => navigate('/login')}
      >
        Ya tengo cuenta
      </Button>
    </form>
  );
}

export default RegisterForm;
