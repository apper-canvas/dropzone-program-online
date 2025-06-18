import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { fileService } from '@/services'

const FileSidebar = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      loadFiles()
    }
  }, [isOpen])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const fileData = await fileService.getAll()
      setFiles(fileData.filter(f => f.status === 'completed'))
    } catch (err) {
      setError('Failed to load files')
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileId, fileName) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    try {
      await fileService.delete(fileId)
      setFiles(prev => prev.filter(f => f.Id !== fileId))
      toast.success(`Deleted ${fileName}`)
    } catch (err) {
      toast.error(`Failed to delete ${fileName}`)
    }
  }

  const handleReUpload = async (file) => {
    try {
      const reUploadedFile = await fileService.reUpload(file.Id)
      toast.success(`Re-uploading ${file.name}`)
      // Refresh the file list to show the new entry
      loadFiles()
    } catch (err) {
      toast.error(`Failed to re-upload ${file.name}`)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image'
    if (type === 'application/pdf') return 'FileText'
    if (type.includes('spreadsheet') || type.includes('excel')) return 'Table'
    if (type.includes('document') || type.includes('word')) return 'FileText'
    return 'File'
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:relative inset-y-0 left-0 w-80 bg-surface-800 border-r border-surface-700 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-700">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Files" size={20} className="text-primary" />
            <h2 className="text-lg font-display font-semibold text-white">
              Uploaded Files
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700 transition-colors"
            aria-label="Close sidebar"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <Button variant="ghost" onClick={loadFiles} size="small">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && files.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="FileX" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No files uploaded yet</p>
            </div>
          )}

          {!loading && !error && files.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 mb-4">
                {files.length} file{files.length !== 1 ? 's' : ''} uploaded
              </p>
              
              {files.map((file) => (
                <motion.div
                  key={file.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-700/50 rounded-lg p-4 border border-surface-600 hover:border-surface-500 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon 
                          name={getFileIcon(file.type)} 
                          size={20} 
                          className="text-white" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFileSize(file.size)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(file.uploadedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="ghost"
                      size="small"
                      icon="Upload"
                      onClick={() => handleReUpload(file)}
                      className="flex-1"
                    >
                      Re-upload
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      icon="Trash2"
                      onClick={() => handleDelete(file.Id, file.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-700">
          <Button
            variant="ghost"
            size="small"
            icon="RefreshCw"
            onClick={loadFiles}
            className="w-full"
            disabled={loading}
          >
            Refresh Files
          </Button>
        </div>
      </motion.div>
    </>
  )
}

export default FileSidebar