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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [allFiles, setAllFiles] = useState([])

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
      const completedFiles = fileData.filter(f => f.status === 'completed')
      setAllFiles(completedFiles)
      filterFiles(completedFiles, searchTerm, filterType)
    } catch (err) {
      setError('Failed to load files')
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const filterFiles = (fileList, search, type) => {
    let filtered = [...fileList]
    
    if (search.trim()) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (type !== 'all') {
      filtered = filtered.filter(file => {
        switch (type) {
          case 'images':
            return file.type.startsWith('image/')
          case 'documents':
            return file.type.includes('document') || file.type.includes('word')
          case 'spreadsheets':
            return file.type.includes('spreadsheet') || file.type.includes('excel')
          case 'pdfs':
            return file.type === 'application/pdf'
          default:
            return true
        }
      })
    }
    
    setFiles(filtered)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    filterFiles(allFiles, value, filterType)
  }

  const handleFilterChange = (e) => {
    const value = e.target.value
    setFilterType(value)
    filterFiles(allFiles, searchTerm, value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    filterFiles(allFiles, '', filterType)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    filterFiles(allFiles, '', 'all')
  }

const handleDelete = async (fileId, fileName) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    try {
      await fileService.delete(fileId)
      const updatedAllFiles = allFiles.filter(f => f.Id !== fileId)
      setAllFiles(updatedAllFiles)
      filterFiles(updatedAllFiles, searchTerm, filterType)
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

        {/* Search and Filter */}
        <div className="p-4 border-b border-surface-700 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <ApperIcon name="Filter" size={16} className="text-gray-400" />
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="flex-1 py-2 px-3 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="documents">Documents</option>
              <option value="spreadsheets">Spreadsheets</option>
              <option value="pdfs">PDFs</option>
            </select>
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
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

{!loading && !error && files.length === 0 && allFiles.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="FileX" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No files uploaded yet</p>
            </div>
          )}

          {!loading && !error && files.length === 0 && allFiles.length > 0 && (
            <div className="text-center py-8">
              <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No files match your search</p>
              <Button variant="ghost" onClick={resetFilters} size="small">
                Clear Filters
              </Button>
            </div>
          )}

          {!loading && !error && files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  {files.length} of {allFiles.length} file{allFiles.length !== 1 ? 's' : ''}
                </p>
                {(searchTerm || filterType !== 'all') && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-primary hover:text-primary-light transition-colors"
                  >
                    Show All
                  </button>
                )}
              </div>
              
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