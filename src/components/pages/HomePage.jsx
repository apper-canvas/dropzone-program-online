import { motion } from 'framer-motion';
import FileUploader from '@/components/organisms/FileUploader';
import ApperIcon from '@/components/ApperIcon';

const HomePage = () => {
  const pageTransitionInitial = { opacity: 0, y: 20 };
  const pageTransitionAnimate = { opacity: 1, y: 0 };
  const pageTransitionConfig = { duration: 0.6, ease: "easeOut" };

  return (
    <motion.div
      initial={pageTransitionInitial}
      animate={pageTransitionAnimate}
      transition={pageTransitionConfig}
      className="min-h-full bg-background"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
              <ApperIcon name="Upload" size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DropZone
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload and manage your files with ease. Drag, drop, and watch your files upload seamlessly.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: 'MousePointer',
              title: 'Drag & Drop',
              description: 'Simply drag files onto the upload area'
            },
            {
              icon: 'Zap',
              title: 'Fast Upload',
              description: 'Optimized for quick and reliable uploads'
            },
            {
              icon: 'Shield',
              title: 'Secure',
              description: 'Your files are handled with care and security'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              className="text-center p-6 bg-surface-800/30 backdrop-blur-sm border border-surface-700 rounded-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name={feature.icon} size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <FileUploader />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;