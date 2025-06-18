import sharedLinksData from '../mockData/sharedLinks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ShareService {
  constructor() {
    this.sharedLinks = [...sharedLinksData];
    this.nextId = Math.max(...this.sharedLinks.map(l => l.Id), 0) + 1;
  }

  async generateLink(fileId, fileName, expiryDays = 7) {
    await delay(300);
    
    // Generate a secure random token
    const token = this.generateSecureToken();
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/shared/${token}`;
    
    const expiresAt = expiryDays ? 
      new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString() : 
      null;

    const sharedLink = {
      Id: this.nextId++,
      fileId: parseInt(fileId, 10),
      fileName,
      token,
      link,
      createdAt: new Date().toISOString(),
      expiresAt,
      isActive: true,
      accessCount: 0
    };

    this.sharedLinks.push(sharedLink);
    return { ...sharedLink };
  }

  async getByToken(token) {
    await delay(200);
    const link = this.sharedLinks.find(l => l.token === token && l.isActive);
    
    if (!link) {
      throw new Error('Share link not found or expired');
    }

    // Check if link has expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      throw new Error('Share link has expired');
    }

    // Increment access count
    link.accessCount += 1;
    
    return { ...link };
  }

  async validateLink(token) {
    await delay(200);
    try {
      const link = await this.getByToken(token);
      return { valid: true, link };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async revokeLink(linkUrl) {
    await delay(200);
    const token = linkUrl.split('/').pop();
    const index = this.sharedLinks.findIndex(l => l.token === token);
    
    if (index === -1) {
      throw new Error('Share link not found');
    }

    this.sharedLinks[index].isActive = false;
    return true;
  }

  async getAll() {
    await delay(300);
    return this.sharedLinks
      .filter(l => l.isActive)
      .map(l => ({ ...l }));
  }

  async getAllByFileId(fileId) {
    await delay(200);
    return this.sharedLinks
      .filter(l => l.fileId === parseInt(fileId, 10) && l.isActive)
      .map(l => ({ ...l }));
  }

  async delete(id) {
    await delay(200);
    const index = this.sharedLinks.findIndex(l => l.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Share link not found');
    
    this.sharedLinks.splice(index, 1);
    return true;
  }

  generateSecureToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async cleanupExpiredLinks() {
    await delay(200);
    const now = new Date();
    const initialCount = this.sharedLinks.length;
    
    this.sharedLinks = this.sharedLinks.filter(link => {
      if (!link.expiresAt) return true; // Never expires
      return new Date(link.expiresAt) > now;
    });

    const cleanedCount = initialCount - this.sharedLinks.length;
    return { cleanedCount };
  }
}

export default new ShareService();