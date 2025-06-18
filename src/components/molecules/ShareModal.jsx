import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { shareService } from '@/services';

const ShareModal = ({ file, isOpen, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [expiryOption, setExpiryOption] = useState('7'); // 7 days default
  const [loading, setLoading] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const expiryOptions = [
    { value: '0.04', label: '1 Hour', days: 0.04 },
    { value: '1', label: '24 Hours', days: 1 },
    { value: '7', label: '7 Days', days: 7 },
    { value: '30', label: '30 Days', days: 30 },
    { value: 'never', label: 'Never Expires', days: null }
  ];

  useEffect(() => {
    if (isOpen && file) {
      generateShareLink();
    }
    return () => {
      if (!isOpen) {
        setShareLink('');
        setLinkGenerated(false);
        setExpiryOption('7');
      }
    };
  }, [isOpen, file]);

  const generateShareLink = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const expiryDays = expiryOption === 'never' ? null : parseFloat(expiryOption);
      const result = await shareService.generateLink(file.id, file.name, expiryDays);
      setShareLink(result.link);
      setLinkGenerated(true);
      toast.success('Share link generated successfully');
    } catch (error) {
      toast.error('Failed to generate share link');
      console.error('Share link generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpiryChange = (newExpiry) => {
    setExpiryOption(newExpiry);
    if (linkGenerated) {
      generateShareLink();
    }
  };

  const handleCopy = () => {
    toast.success('Link copied to clipboard!');
  };

  const handleRevokeLink = async () => {
    if (!shareLink) return;
    
    setLoading(true);
    try {
      await shareService.revokeLink(shareLink);
      setShareLink('');
      setLinkGenerated(false);
      toast.success('Share link revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke share link');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-surface-800 border border-surface-700 rounded-xl p-6 w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-surface-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Share2" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-white">
                  Share File
                </h2>
                <p className="text-sm text-gray-400 truncate max-w-48">
                  {file?.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="small"
              icon="X"
              onClick={onClose}
              className="p-1"
            />
          </div>

          {/* Expiry Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">
              Link Expiry
            </label>
            <div className="grid grid-cols-2 gap-2">
              {expiryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleExpiryChange(option.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    expiryOption === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-surface-600 bg-surface-700/50 text-gray-300 hover:border-surface-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Share Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">
              Share Link
            </label>
            {loading ? (
              <div className="bg-surface-700 rounded-lg p-4 flex items-center justify-center">
                <ApperIcon name="Loader2" size={20} className="text-primary animate-spin" />
                <span className="ml-2 text-gray-400">Generating link...</span>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="w-full bg-surface-700 border border-surface-600 rounded-lg px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:border-primary"
                  placeholder="Link will appear here..."
                />
                {shareLink && (
                  <CopyToClipboard text={shareLink} onCopy={handleCopy}>
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors">
                      <ApperIcon name="Copy" size={16} />
                    </button>
                  </CopyToClipboard>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {shareLink && (
              <CopyToClipboard text={shareLink} onCopy={handleCopy}>
                <Button
                  variant="primary"
                  icon="Copy"
                  className="flex-1"
                >
                  Copy Link
                </Button>
              </CopyToClipboard>
            )}
            
            {linkGenerated && (
              <Button
                variant="ghost"
                icon="Ban"
                onClick={handleRevokeLink}
                disabled={loading}
                className="text-error hover:text-error"
              >
                Revoke
              </Button>
            )}
          </div>

          {/* Link Info */}
          {linkGenerated && (
            <div className="mt-4 p-3 bg-surface-700/30 rounded-lg">
              <div className="flex items-center text-xs text-gray-400">
                <ApperIcon name="Info" size={14} className="mr-2" />
                {expiryOption === 'never' 
                  ? 'This link will never expire'
                  : `Link expires in ${expiryOptions.find(o => o.value === expiryOption)?.label.toLowerCase()}`
                }
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareModal;