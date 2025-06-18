const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UploadService {
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