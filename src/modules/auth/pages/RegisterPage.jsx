import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className='flex flex-col justify-center min-h-screen bg-gray-100 items-center px-4'>
      <div className='mb-8 text-center'>
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>Dsw2025Tpi</h1>
        <p className='text-gray-600'>Sistema de Gestión</p>
      </div>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
