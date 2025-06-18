import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  const backdropInitial = { opacity: 0 };
  const backdropAnimate = { opacity: 1 };
  const backdropExit = { opacity: 0 };

  const modalInitial = { opacity: 0, scale: 0.95 };
  const modalAnimate = { opacity: 1, scale: 1 };
  const modalExit = { opacity: 0, scale: 0.95 };

  return (
    <AnimatePresence>
      <motion.div
        initial={backdropInitial}
        animate={backdropAnimate}
        exit={backdropExit}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={modalInitial}
          animate={modalAnimate}
          exit={modalExit}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface-800 rounded-xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-700">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Eye" size={20} className="text-primary" />
              <div>
                <h2 className="text-lg font-display font-semibold text-white">
                  {file.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {file.size && `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="small"
              icon="X"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            />
          </div>
          
          {/* Content */}
          <div className="p-4 max-h-[calc(90vh-120px)] overflow-auto">
            {file.type.startsWith('image/') ? (
              <div className="flex justify-center">
                <img
                  src={file.url || file.thumbnailUrl}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="File" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Preview not available for this file type</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end space-x-3 p-4 border-t border-surface-700">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {file.url && (
              <Button
                variant="primary"
                icon="Download"
                onClick={() => window.open(file.url, '_blank')}
              >
                Download
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreviewModal;