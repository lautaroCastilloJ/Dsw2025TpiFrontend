import LoginForm from '../components/LoginForm';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

function LoginPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='
        flex
        flex-col
        justify-center
        flex-grow
        bg-gradient-to-br
        from-blue-500
        to-purple-600
        sm:items-center
      '>
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
