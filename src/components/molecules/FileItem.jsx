import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CircularProgress from '@/components/atoms/CircularProgress';
import { uploadService } from '@/services';

const FileItem = ({ file, onUpdate, onRemove, onPreview }) => {
  const handleRemove = () => {
    onRemove(file.id);
    toast.success(`Removed ${file.name}`);
  };

  const handlePreview = () => {
    if (file.type.startsWith('image/') && file.url) {
      onPreview(file);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-accent';
      case 'uploading': return 'text-primary';
      case 'failed': return 'text-error';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'uploading': return 'Loader2';
      case 'failed': return 'XCircle';
      default: return 'Clock';
    }
  };

  const canPreview = file.type.startsWith('image/') && (file.url || file.thumbnailUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-800/50 backdrop-blur-sm border border-surface-700 rounded-lg p-4"
    >
      <div className="flex items-center space-x-3">
        {/* File Icon */}
        <div className="flex-shrink-0">
          {canPreview ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreview}
              className="w-10 h-10 rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={file.thumbnailUrl || file.url}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <div className="w-10 h-10 bg-surface-700 rounded-lg flex items-center justify-center">
              <ApperIcon 
                name={uploadService.getFileIcon(file.type)} 
                size={20} 
                className="text-gray-400" 
              />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-white truncate pr-2">
              {file.name}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {file.status === 'uploading' && (
                <CircularProgress 
                  progress={file.progress} 
                  size={24} 
                  strokeWidth={2}
                  showPercentage={false}
                />
              )}
              <ApperIcon
                name={getStatusIcon(file.status)}
                size={16}
                className={`${getStatusColor(file.status)} ${
                  file.status === 'uploading' ? 'animate-spin' : ''
                }`}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{uploadService.formatFileSize(file.size)}</span>
            <span className="capitalize">{file.status}</span>
          </div>

          {/* Progress Bar for uploading files */}
          {file.status === 'uploading' && (
            <div className="mt-2">
              <div className="w-full bg-surface-700 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {canPreview && (
            <Button
              variant="ghost"
              size="small"
              icon="Eye"
              onClick={handlePreview}
              className="p-1"
            />
          )}
          <Button
            variant="ghost"
            size="small"
            icon="X"
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-error"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FileItem;