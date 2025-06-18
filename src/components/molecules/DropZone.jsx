import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { uploadService } from '@/services';

const DropZone = ({ onFilesAdded, acceptedTypes = [], maxFileSize = 10 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    // Reset input
    e.target.value = '';
  };

  const processFiles = (files) => {
    const validFiles = [];
    
    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        toast.error(`${file.name} is too large. Maximum size is ${uploadService.formatFileSize(maxFileSize)}`);
        return;
      }
      
      // Check file type
      if (acceptedTypes.length > 0 && !uploadService.isValidFileType(file, acceptedTypes)) {
        toast.error(`${file.name} is not a supported file type`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
      toast.success(`Added ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}`);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
        ${isDragging 
          ? 'border-primary bg-primary/5 scale-105' 
          : 'border-surface-600 hover:border-surface-500'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        accept={acceptedTypes.join(',')}
        className="hidden"
      />
      
      <motion.div
        animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex justify-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
            ${isDragging 
              ? 'bg-gradient-to-r from-primary to-secondary' 
              : 'bg-surface-700'
            }
          `}>
            <ApperIcon 
              name={isDragging ? "Download" : "Upload"} 
              size={24} 
              className="text-white" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-display font-semibold text-white">
            {isDragging ? "Drop files here" : "Drop files to upload"}
          </h3>
          <p className="text-gray-400">
            or <button 
              onClick={openFileDialog}
              className="text-primary hover:text-secondary underline"
            >
              browse files
            </button>
          </p>
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          {acceptedTypes.length > 0 && (
            <p>Supported formats: {acceptedTypes.join(', ')}</p>
          )}
          <p>Maximum file size: {uploadService.formatFileSize(maxFileSize)}</p>
        </div>
      </motion.div>
      
      <div className="mt-6">
        <Button
          onClick={openFileDialog}
          variant="primary"
          icon="FolderOpen"
          className="mx-auto"
        >
          Browse Files
        </Button>
      </div>
    </motion.div>
  );
};

export default DropZone;