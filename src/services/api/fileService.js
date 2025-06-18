import fileData from '../mockData/files.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FileService {
  constructor() {
    this.files = [...fileData];
    this.nextId = Math.max(...this.files.map(f => f.Id)) + 1;
  }

  async getAll() {
    await delay(300);
    return [...this.files];
  }

  async getById(id) {
    await delay(200);
    const file = this.files.find(f => f.Id === parseInt(id, 10));
    return file ? { ...file } : null;
  }

  async create(fileData) {
    await delay(400);
    const newFile = {
      ...fileData,
      Id: this.nextId++,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      progress: 0
    };
    this.files.push(newFile);
    return { ...newFile };
  }

  async update(id, updates) {
    await delay(200);
    const index = this.files.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) throw new Error('File not found');
    
    const { Id, ...allowedUpdates } = updates;
    this.files[index] = { ...this.files[index], ...allowedUpdates };
    return { ...this.files[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.files.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) throw new Error('File not found');
    
    this.files.splice(index, 1);
    return true;
  }

async deleteAll() {
    await delay(300);
    this.files = [];
    return true;
  }

  async reUpload(id) {
    await delay(300);
    const originalFile = this.files.find(f => f.Id === parseInt(id, 10));
    if (!originalFile) throw new Error('File not found');
    
    const reUploadedFile = {
      ...originalFile,
      Id: this.nextId++,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      progress: 0
    };
    
    this.files.push(reUploadedFile);
    return { ...reUploadedFile };
  }
}

export default new FileService();