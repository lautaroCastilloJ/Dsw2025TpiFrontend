import RegisterForm from '../components/RegisterForm';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

function RegisterPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div
        className='
          flex
          justify-center
          items-center
          flex-grow
          bg-gradient-to-br
          from-blue-500
          to-purple-600
          p-4
        '
      >
        <RegisterForm />
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;
