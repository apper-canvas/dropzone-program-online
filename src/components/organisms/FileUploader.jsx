import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/molecules/DropZone";
import FileItem from "@/components/molecules/FileItem";
import FilePreviewModal from "@/components/molecules/FilePreviewModal";
import UploadStats from "@/components/molecules/UploadStats";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { uploadService } from "@/services";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [compressionEnabled, setCompressionEnabled] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(0.8);
  
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
    {/* Compression Settings */}
    <motion.div
        initial={{
            opacity: 0,
            y: -20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="bg-surface-800 rounded-xl p-6 border border-surface-700">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-white">Compression Settings
                                          </h3>
            <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">Enable Compression</span>
                <button
                    onClick={() => setCompressionEnabled(!compressionEnabled)}
                    className={`
                relative w-12 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary
                ${compressionEnabled ? "bg-gradient-to-r from-primary to-secondary" : "bg-surface-600"}
              `}>
                    <div
                        className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200
                ${compressionEnabled ? "left-7" : "left-1"}
              `} />
                </button>
            </div>
        </div>
        {compressionEnabled && <motion.div
            initial={{
                opacity: 0,
                height: 0
            }}
            animate={{
                opacity: 1,
                height: "auto"
            }}
            exit={{
                opacity: 0,
                height: 0
            }}
            className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Compression Level
                                                                </label>
                    <span className="text-sm text-gray-400">
                        {Math.round(compressionLevel * 100)}% Quality
                                                                </span>
                </div>
                <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={compressionLevel}
                    onChange={e => setCompressionLevel(parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-600 rounded-lg appearance-none cursor-pointer slider" />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>High Compression</span>
                    <span>Low Compression</span>
                </div>
            </div>
            <div className="text-sm text-gray-400 bg-surface-700 rounded-lg p-3">
                <p className="flex items-center space-x-2">
                    <ApperIcon name="Info" size={16} className="text-blue-400" />
                    <span>Higher compression reduces file size but may affect quality. 
                                                                  {compressionLevel >= 0.8 ? " Recommended for photos." : compressionLevel >= 0.5 ? " Balanced quality and size." : " Maximum compression."}
                    </span>
                </p>
            </div>
        </motion.div>}
    </motion.div>
    {/* Drop Zone */}
    <DropZone
        onFilesAdded={handleFilesAdded}
        acceptedTypes={acceptedTypes}
        maxFileSize={10 * 1024 * 1024}
        compressionEnabled={compressionEnabled}
        compressionLevel={compressionLevel} />
    {/* Upload Stats */}
    {hasFiles && <UploadStats files={files} />}
    {/* Action Buttons */}
    {hasFiles && <motion.div
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="flex flex-wrap gap-3 justify-center">
        <Button
            variant="primary"
            icon="Upload"
            onClick={handleUploadAll}
            disabled={uploading || pendingFiles.length === 0}
            loading={uploading}>Upload All ({pendingFiles.length})
                                  </Button>
        <Button
            variant="ghost"
            icon="Trash2"
            onClick={handleClearAll}
            disabled={uploading}>Clear All
                                  </Button>
    </motion.div>}
    {/* File List */}
    {hasFiles && <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        className="space-y-3">
        <h2 className="text-xl font-display font-semibold text-white">Files ({files.length})
                                  </h2>
        <AnimatePresence>
            {files.map((file, index) => <motion.div
                key={file.id}
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    opacity: 0,
                    y: -20
                }}
                transition={{
                    delay: index * 0.1
                }}>
                <FileItem
                    file={file}
                    onUpdate={handleFileUpdate}
                    onRemove={handleFileRemove}
                    onPreview={handlePreview} />
            </motion.div>)}
        </AnimatePresence>
    </motion.div>}
    {/* Preview Modal */}
    <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)} />
</div>
  );
};

export default FileUploader;