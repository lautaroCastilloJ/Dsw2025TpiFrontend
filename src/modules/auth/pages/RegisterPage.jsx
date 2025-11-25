import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div
      className='
        flex
        justify-center
        items-center
        min-h-screen
        bg-gradient-to-br
        from-blue-500
        to-purple-600
        p-4
      '
    >
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
