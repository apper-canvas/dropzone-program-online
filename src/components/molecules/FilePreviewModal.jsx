import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !file) return null;

  const backdropInitial = { opacity: 0 };
  const backdropAnimate = { opacity: 1 };
  const backdropExit = { opacity: 0 };

  const modalInitial = { opacity: 0, scale: 0.95 };
  const modalAnimate = { opacity: 1, scale: 1 };
  const modalExit = { opacity: 0, scale: 0.95 };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading document:', error);
    setLoading(false);
  };

  const goToPreviousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const isPDF = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');
  const isDocument = file.type === 'application/msword' || 
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

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
          className="bg-surface-800 rounded-xl shadow-2xl max-w-5xl max-h-[95vh] w-full overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Eye" size={20} className="text-primary" />
              <div>
                <h2 className="text-lg font-display font-semibold text-white">
                  {file.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {file.size && `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  {isPDF && numPages && ` • ${numPages} pages`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isPDF && (
                <>
                  <Button
                    variant="ghost"
                    size="small"
                    icon="ZoomOut"
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="text-gray-400 hover:text-white"
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={resetZoom}
                    className="text-gray-400 hover:text-white text-xs px-2"
                  >
                    {Math.round(scale * 100)}%
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon="ZoomIn"
                    onClick={zoomIn}
                    disabled={scale >= 3}
                    className="text-gray-400 hover:text-white"
                  />
                </>
              )}
              <Button
                variant="ghost"
                size="small"
                icon="X"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-100">
            <div className="p-4 flex justify-center min-h-full">
              {isImage ? (
                <img
                  src={file.url || file.thumbnailUrl}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : isPDF ? (
                <div className="bg-white shadow-lg">
                  <Document
                    file={file.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex items-center justify-center p-8">
                        <ApperIcon name="Loader2" size={32} className="text-primary animate-spin" />
                        <span className="ml-2 text-gray-600">Loading document...</span>
                      </div>
                    }
                    error={
                      <div className="text-center py-12">
                        <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                        <p className="text-red-600">Failed to load PDF document</p>
                      </div>
                    }
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
              ) : isDocument ? (
                <div className="text-center py-12">
                  <ApperIcon name="FileText" size={48} className="text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Word document preview</p>
                  <p className="text-sm text-gray-500">
                    Click download to view the full document
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="File" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Page Navigation for PDFs */}
          {isPDF && numPages > 1 && (
            <div className="flex items-center justify-center space-x-4 p-3 bg-surface-700/50 border-t border-surface-700">
              <Button
                variant="ghost"
                size="small"
                icon="ChevronLeft"
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
                className="text-gray-400 hover:text-white"
              />
              <span className="text-sm text-gray-300">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant="ghost"
                size="small"
                icon="ChevronRight"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="text-gray-400 hover:text-white"
              />
            </div>
          )}
          
          {/* Footer */}
          <div className="flex justify-end space-x-3 p-4 border-t border-surface-700 flex-shrink-0">
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