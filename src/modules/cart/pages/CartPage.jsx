import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useAuth from '../../auth/hook/useAuth';
import { createOrder } from '../../orders/services/createService';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';
import Swal from 'sweetalert2';

function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId, productName) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Deseas eliminar "${productName}" del carrito?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId);
        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: '¿Deseas eliminar todos los productos del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          icon: 'success',
          title: 'Carrito vaciado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'info',
        title: 'Iniciar Sesión Requerido',
        text: 'Debes iniciar sesión para realizar una compra',
        showCancelButton: true,
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Crear Cuenta',
      }).then((result) => {
        if (result.isConfirmed) {
          setShowLoginModal(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setShowRegisterModal(true);
        }
      });

      return;
    }

    // Si está autenticado, solicitar direcciones y crear la orden
    const { value: formValues } = await Swal.fire({
      title: 'Datos de Envío',
      html:
        '<input id="swal-shipping-street" class="swal2-input" placeholder="Calle y Número">' +
        '<input id="swal-shipping-city" class="swal2-input" placeholder="Ciudad">' +
        '<input id="swal-shipping-state" class="swal2-input" placeholder="Provincia">' +
        '<input id="swal-shipping-zip" class="swal2-input" placeholder="Código Postal">' +
        '<br><label class="swal2-checkbox"><input type="checkbox" id="swal-same-address"> Usar misma dirección para facturación</label>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          shippingStreet: document.getElementById('swal-shipping-street').value,
          shippingCity: document.getElementById('swal-shipping-city').value,
          shippingState: document.getElementById('swal-shipping-state').value,
          shippingZip: document.getElementById('swal-shipping-zip').value,
          sameAddress: document.getElementById('swal-same-address').checked,
        };
      },
    });

    if (!formValues) return;

    const { shippingStreet, shippingCity, shippingState, shippingZip, sameAddress } = formValues;

    if (!shippingStreet || !shippingCity || !shippingState || !shippingZip) {
      Swal.fire('Error', 'Todos los campos de dirección son requeridos', 'error');

      return;
    }

    let billingAddress = '';

    if (!sameAddress) {
      const { value: billingValues } = await Swal.fire({
        title: 'Dirección de Facturación',
        html:
          '<input id="swal-billing-street" class="swal2-input" placeholder="Calle y Número">' +
          '<input id="swal-billing-city" class="swal2-input" placeholder="Ciudad">' +
          '<input id="swal-billing-state" class="swal2-input" placeholder="Provincia">' +
          '<input id="swal-billing-zip" class="swal2-input" placeholder="Código Postal">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Finalizar Compra',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          return {
            billingStreet: document.getElementById('swal-billing-street').value,
            billingCity: document.getElementById('swal-billing-city').value,
            billingState: document.getElementById('swal-billing-state').value,
            billingZip: document.getElementById('swal-billing-zip').value,
          };
        },
      });

      if (!billingValues) return;

      const { billingStreet, billingCity, billingState, billingZip } = billingValues;

      if (!billingStreet || !billingCity || !billingState || !billingZip) {
        Swal.fire('Error', 'Todos los campos de dirección son requeridos', 'error');

        return;
      }

      billingAddress = `${billingStreet}, ${billingCity}, ${billingState}, ${billingZip}`.trim();
    }

    const shippingAddress = `${shippingStreet}, ${shippingCity}, ${shippingState}, ${shippingZip}`.trim();

    if (sameAddress) {
      billingAddress = shippingAddress;
    }

    // Crear la orden
    setProcessingOrder(true);
    try {
      const orderData = {
        shippingAddress,
        billingAddress,
        notes: '',
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.currentUnitPrice,
        })),
      };

      const { error } = await createOrder(orderData);

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la orden',
          text: error,
        });

        return;
      }

      // Limpiar carrito y redirigir
      clearCart();

      await Swal.fire({
        icon: 'success',
        title: '¡Compra Exitosa!',
        text: 'Tu orden ha sido creada correctamente',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al procesar tu compra',
      });
    } finally {
      setProcessingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white border border-gray-200">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700">Tu carrito está vacío</h2>
            <p className="text-gray-500">Agrega productos para comenzar tu compra</p>
            <Button onClick={() => navigate('/')} className="mt-4 !bg-gray-800 hover:!bg-gray-700 !text-white">
              Ver Productos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Carrito de Compras</h1>
              <Button
                onClick={handleClearCart}
                className="!bg-gray-700 hover:!bg-gray-600 !text-white"
              >
                Vaciar Carrito
              </Button>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow border border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-lg font-bold text-gray-800 mt-2">
                        ${item.currentUnitPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Control de cantidad */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 font-semibold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1 font-semibold"
                          min="1"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-gray-700 font-semibold"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-sm text-gray-600 font-medium">Subtotal</p>
                        <p className="text-lg font-bold text-gray-800">
                          ${(item.currentUnitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="text-gray-600 hover:text-gray-800 p-2"
                        title="Eliminar producto"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 bg-white border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Productos ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={processingOrder}
              className="w-full !bg-gray-800 hover:!bg-gray-700 !text-white text-lg py-3 font-semibold"
            >
              {processingOrder ? 'Procesando...' : 'Finalizar Compra'}
            </Button>

            <Button
              onClick={() => navigate('/')}
              className="w-full mt-3 !bg-gray-200 hover:!bg-gray-300 !text-gray-800 font-medium"
            >
              Seguir Comprando
            </Button>
          </Card>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        requireClientRole={true}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}

export default CartPage;
