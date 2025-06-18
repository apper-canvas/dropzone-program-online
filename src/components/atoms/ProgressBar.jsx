import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  variant = 'primary',
  size = 'medium',
  showPercentage = false,
  className = ''
}) => {
  const variants = {
    primary: 'from-primary to-secondary',
    success: 'from-accent to-emerald-600',
    danger: 'from-error to-red-600',
    warning: 'from-warning to-yellow-600'
  };

  const sizes = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`w-full bg-surface-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${variants[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="absolute right-0 top-0 -mt-6 text-xs text-gray-400">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;