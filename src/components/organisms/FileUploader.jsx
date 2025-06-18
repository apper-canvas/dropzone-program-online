import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/molecules/DropZone';
import FileItem from '@/components/molecules/FileItem';
import FilePreviewModal from '@/components/molecules/FilePreviewModal';
import UploadStats from '@/components/molecules/UploadStats';
import Button from '@/components/atoms/Button';
import { uploadService } from '@/services';
const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const acceptedTypes = [
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const handleFilesAdded = (newFiles) => {
    const fileItems = newFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      file: file,
      url: null,
      thumbnailUrl: null
    }));
    
    setFiles(prev => [...prev, ...fileItems]);
  };

  const handleFileUpdate = (fileId, updates) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, ...updates } : file
    ));
  };

  const handleFileRemove = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.length === 0) {
      toast.info('No files to upload');
      return;
    }

    setUploading(true);
    
    for (const file of pendingFiles) {
      try {
        // Update status to uploading
        handleFileUpdate(file.id, { status: 'uploading', progress: 0 });
        
        // Simulate upload with progress
        const result = await uploadService.simulateUpload(file.file, (progress) => {
          handleFileUpdate(file.id, { progress });
        });
        
        // Update with completion
        handleFileUpdate(file.id, { 
          status: 'completed', 
          progress: 100,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl
        });
        
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        handleFileUpdate(file.id, { status: 'failed', progress: 0 });
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }
    
    setUploading(false);
  };

  const handleClearAll = () => {
    setFiles([]);
    toast.info('Cleared all files');
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const pendingFiles = files.filter(f => f.status === 'pending');
  const hasFiles = files.length > 0;

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <DropZone
        onFilesAdded={handleFilesAdded}
        acceptedTypes={acceptedTypes}
        maxFileSize={10 * 1024 * 1024} // 10MB
      />

      {/* Upload Stats */}
      {hasFiles && <UploadStats files={files} />}

      {/* Action Buttons */}
      {hasFiles && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Button
            variant="primary"
            icon="Upload"
            onClick={handleUploadAll}
            disabled={uploading || pendingFiles.length === 0}
            loading={uploading}
          >
            Upload All ({pendingFiles.length})
          </Button>
          
          <Button
            variant="ghost"
            icon="Trash2"
            onClick={handleClearAll}
            disabled={uploading}
          >
            Clear All
          </Button>
        </motion.div>
      )}

      {/* File List */}
      {hasFiles && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-display font-semibold text-white">
            Files ({files.length})
          </h2>
          
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <FileItem
                  file={file}
                  onUpdate={handleFileUpdate}
                  onRemove={handleFileRemove}
                  onPreview={handlePreview}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default FileUploader;