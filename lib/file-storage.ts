// Mock file storage system using localStorage
// In a real application, this would connect to AWS S3 or similar

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  createdAt: Date
  modifiedAt: Date
  parentId?: string
  content?: string
  mimeType?: string
}

export interface Folder extends FileItem {
  type: 'folder'
  children: string[]
}

export class FileStorage {
  private static STORAGE_KEY = 'ggldrive_files'
  private static ROOT_FOLDER_ID = 'root'

  static getFiles(): FileItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) {
      // Initialize with a root folder
      const rootFolder: Folder = {
        id: this.ROOT_FOLDER_ID,
        name: 'My Drive',
        type: 'folder',
        createdAt: new Date(),
        modifiedAt: new Date(),
        children: []
      }
      this.saveFiles([rootFolder])
      return [rootFolder]
    }
    return JSON.parse(stored).map((file: any) => ({
      ...file,
      createdAt: new Date(file.createdAt),
      modifiedAt: new Date(file.modifiedAt)
    }))
  }

  static saveFiles(files: FileItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files))
  }

  static getFileById(id: string): FileItem | null {
    const files = this.getFiles()
    return files.find(file => file.id === id) || null
  }

  static getFilesByParent(parentId: string = this.ROOT_FOLDER_ID): FileItem[] {
    const files = this.getFiles()
    return files.filter(file => file.parentId === parentId)
  }

  static createFolder(name: string, parentId: string = this.ROOT_FOLDER_ID): Folder {
    const files = this.getFiles()
    const newFolder: Folder = {
      id: this.generateId(),
      name,
      type: 'folder',
      createdAt: new Date(),
      modifiedAt: new Date(),
      parentId,
      children: []
    }
    
    files.push(newFolder)
    
    // Update parent folder's children
    const parent = files.find(f => f.id === parentId) as Folder
    if (parent) {
      parent.children.push(newFolder.id)
      parent.modifiedAt = new Date()
    }
    
    this.saveFiles(files)
    return newFolder
  }

  static uploadFile(file: File, parentId: string = this.ROOT_FOLDER_ID): Promise<FileItem> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const files = this.getFiles()
        const newFile: FileItem = {
          id: this.generateId(),
          name: file.name,
          type: 'file',
          size: file.size,
          mimeType: file.type,
          content: e.target?.result as string,
          createdAt: new Date(),
          modifiedAt: new Date(),
          parentId
        }
        
        files.push(newFile)
        
        // Update parent folder's children
        const parent = files.find(f => f.id === parentId) as Folder
        if (parent) {
          parent.children.push(newFile.id)
          parent.modifiedAt = new Date()
        }
        
        this.saveFiles(files)
        resolve(newFile)
      }
      reader.readAsDataURL(file)
    })
  }

  static deleteFile(id: string): void {
    const files = this.getFiles()
    const fileToDelete = files.find(f => f.id === id)
    
    if (!fileToDelete) return
    
    // If it's a folder, delete all children recursively
    if (fileToDelete.type === 'folder') {
      const folder = fileToDelete as Folder
      folder.children.forEach(childId => this.deleteFile(childId))
    }
    
    // Remove from parent's children
    if (fileToDelete.parentId) {
      const parent = files.find(f => f.id === fileToDelete.parentId) as Folder
      if (parent) {
        parent.children = parent.children.filter(childId => childId !== id)
        parent.modifiedAt = new Date()
      }
    }
    
    // Remove the file
    const updatedFiles = files.filter(f => f.id !== id)
    this.saveFiles(updatedFiles)
  }

  static renameFile(id: string, newName: string): void {
    const files = this.getFiles()
    const file = files.find(f => f.id === id)
    if (file) {
      file.name = newName
      file.modifiedAt = new Date()
      this.saveFiles(files)
    }
  }

  static downloadFile(file: FileItem): void {
    if (file.type === 'folder') return
    
    const link = document.createElement('a')
    link.href = file.content || ''
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}
