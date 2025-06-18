import imageCompression from 'browser-image-compression';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// File constructor polyfill for cross-environment compatibility
const FileConstructor = typeof File !== 'undefined' 
  ? File 
  : class File {
      constructor(chunks, filename, options = {}) {
        this.name = filename;
        this.type = options.type || '';
        this.lastModified = options.lastModified || Date.now();
        this.size = chunks.reduce((total, chunk) => {
          if (chunk instanceof ArrayBuffer) return total + chunk.byteLength;
          if (typeof chunk === 'string') return total + chunk.length;
          return total + (chunk.size || 0);
        }, 0);
        this._chunks = chunks;
      }
    };

class UploadService {
  async compressFile(file, quality = 0.8) {
    // Handle image compression
    if (file.type.startsWith('image/')) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: quality
        };
const compressedFile = await imageCompression(file, options);
      return new FileConstructor([compressedFile], file.name, {
        type: file.type,
        lastModified: file.lastModified
      });
    } catch (error) {
      throw new Error(`Image compression failed: ${error.message}`);
    }
  }
    // Handle PDF and document compression (simulated)
    if (file.type === 'application/pdf' || 
        file.type.includes('document') || 
        file.type.includes('word') ||
        file.type.includes('spreadsheet') ||
        file.type.includes('excel')) {
      
      // Simulate document compression with quality-based size reduction
      const compressionRatio = 1 - (quality * 0.3); // Up to 30% compression
      const compressedSize = Math.floor(file.size * (1 - compressionRatio));
      
// Create a new file with simulated compressed size
    const compressedArrayBuffer = new ArrayBuffer(compressedSize);
    return new FileConstructor([compressedArrayBuffer], file.name, {
      type: file.type,
      lastModified: file.lastModified
    });
  }
  
  // For other file types, simulate basic compression
    if (file.size > 100 * 1024) { // Only compress files larger than 100KB
      const compressionRatio = 1 - (quality * 0.2); // Up to 20% compression
      const compressedSize = Math.floor(file.size * (1 - compressionRatio));
const compressedArrayBuffer = new ArrayBuffer(compressedSize);
    return new FileConstructor([compressedArrayBuffer], file.name, {
      type: file.type,
      lastModified: file.lastModified
    });
  }
  
  // Return original file if no compression is applicable
    return file;
  }

  getCompressionInfo(originalSize, compressedSize) {
    const savings = originalSize - compressedSize;
    const percentage = ((savings / originalSize) * 100).toFixed(1);
    
    return {
      originalSize: this.formatFileSize(originalSize),
      compressedSize: this.formatFileSize(compressedSize),
      savings: this.formatFileSize(savings),
      percentage: parseFloat(percentage)
    };
  }

  isCompressible(file) {
    return file.type.startsWith('image/') || 
           file.type === 'application/pdf' ||
           file.type.includes('document') ||
           file.type.includes('word') ||
           file.type.includes('spreadsheet') ||
           file.type.includes('excel') ||
           file.size > 100 * 1024; // Files larger than 100KB
  }
  async simulateUpload(file, onProgress) {
    const totalChunks = 10;
    const chunkDelay = 200;
    
    for (let i = 0; i <= totalChunks; i++) {
      await delay(chunkDelay);
      const progress = Math.round((i / totalChunks) * 100);
      onProgress(progress);
      
      // Simulate occasional failure
      if (Math.random() < 0.1 && i < totalChunks) {
        throw new Error('Upload failed');
      }
    }
    
    return {
      url: URL.createObjectURL(file),
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    };
  }

  async uploadFile(file) {
    let progress = 0;
    
    return new Promise((resolve, reject) => {
      this.simulateUpload(file, (progressValue) => {
        progress = progressValue;
      })
      .then(result => resolve({ ...result, progress: 100 }))
      .catch(reject);
    });
  }

  getFileIcon(type) {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Music';
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('document') || type.includes('word')) return 'FileText';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'FileSpreadsheet';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'Presentation';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    return 'File';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isValidFileType(file, acceptedTypes = []) {
    if (acceptedTypes.length === 0) return true;
    return acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type;
    });
  }
}

export default new UploadService();