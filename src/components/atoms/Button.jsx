import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/25 focus:ring-primary",
    secondary: "bg-surface-700 text-white hover:bg-surface-600 focus:ring-surface-500",
    success: "bg-gradient-to-r from-accent to-emerald-600 text-white hover:shadow-lg hover:shadow-accent/25 focus:ring-accent",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/25 focus:ring-error",
    ghost: "text-gray-300 hover:text-white hover:bg-surface-700 focus:ring-surface-500"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const buttonHover = disabled ? {} : { scale: 1.02, filter: "brightness(1.1)" };
  const buttonTap = disabled ? {} : { scale: 0.98 };

  const renderIcon = (position) => {
    if (!icon || iconPosition !== position) return null;
    
    return (
      <ApperIcon 
        name={loading ? "Loader2" : icon} 
        size={size === 'small' ? 14 : size === 'large' ? 20 : 16}
        className={`${loading ? 'animate-spin' : ''} ${
          children && position === 'left' ? 'mr-2' : 
          children && position === 'right' ? 'ml-2' : ''
        }`}
      />
    );
  };

  return (
    <motion.button
      whileHover={buttonHover}
      whileTap={buttonTap}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabledClasses}
        ${className}
      `}
      {...props}
    >
      {renderIcon('left')}
      {children}
      {renderIcon('right')}
    </motion.button>
  );
};

export default Button;