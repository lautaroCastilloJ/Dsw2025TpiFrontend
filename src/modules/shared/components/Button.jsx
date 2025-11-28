function Button({ children, type = 'button', variant = 'default', className = '', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default: 'bg-black hover:bg-gray-800 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200',
  };

  return (
    <button
      {...restProps}
      className={`${variantStyle[variant]} transition ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;