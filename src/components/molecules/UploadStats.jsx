import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { uploadService } from '@/services';

const UploadStats = ({ files = [] }) => {
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const failedFiles = files.filter(f => f.status === 'failed').length;
  const uploadingFiles = files.filter(f => f.status === 'uploading').length;
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

  const stats = [
    {
      label: 'Total Files',
      value: totalFiles,
      icon: 'Files',
      color: 'text-gray-400'
    },
    {
      label: 'Completed',
      value: completedFiles,
      icon: 'CheckCircle',
      color: 'text-accent'
    },
    {
      label: 'Uploading',
      value: uploadingFiles,
      icon: 'Upload',
      color: 'text-primary'
    },
    {
      label: 'Failed',
      value: failedFiles,
      icon: 'XCircle',
      color: 'text-error'
    }
  ];

  if (totalFiles === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-800/50 backdrop-blur-sm border border-surface-700 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-white">
          Upload Summary
        </h3>
        <div className="text-sm text-gray-400">
          {uploadService.formatFileSize(totalSize)} total
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name={stat.icon} size={20} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UploadStats;