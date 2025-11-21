'use client'

import { useState, useEffect } from 'react'
import { FileStorage, FileItem } from '@/lib/file-storage'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { FileGrid } from './FileGrid'
import { UploadModal } from './UploadModal'
import { CreateFolderModal } from './CreateFolderModal'

export function DriveInterface() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>('root')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const loadFiles = () => {
    const currentFiles = FileStorage.getFilesByParent(currentFolder)
    setFiles(currentFiles)
  }

  useEffect(() => {
    loadFiles()
  }, [currentFolder])

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      await FileStorage.uploadFile(files[i], currentFolder)
    }
    loadFiles()
    setShowUploadModal(false)
  }

  const handleCreateFolder = (name: string) => {
    FileStorage.createFolder(name, currentFolder)
    loadFiles()
    setShowCreateFolderModal(false)
  }

  const handleDeleteFiles = (fileIds: string[]) => {
    fileIds.forEach(id => FileStorage.deleteFile(id))
    loadFiles()
    setSelectedFiles([])
  }

  const handleRenameFile = (id: string, newName: string) => {
    FileStorage.renameFile(id, newName)
    loadFiles()
  }

  const handleDownloadFile = (file: FileItem) => {
    FileStorage.downloadFile(file)
  }

  const handleFolderClick = (folder: FileItem) => {
    if (folder.type === 'folder') {
      setCurrentFolder(folder.id)
      setSelectedFiles([])
    }
  }

  const navigateToParent = () => {
    const currentFile = FileStorage.getFileById(currentFolder)
    if (currentFile?.parentId) {
      setCurrentFolder(currentFile.parentId)
      setSelectedFiles([])
    }
  }

  const getCurrentFolderName = () => {
    if (currentFolder === 'root') return 'My Drive'
    const folder = FileStorage.getFileById(currentFolder)
    return folder?.name || 'My Drive'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onUpload={() => setShowUploadModal(true)}
        onCreateFolder={() => setShowCreateFolderModal(true)}
        onDelete={() => handleDeleteFiles(selectedFiles)}
        selectedCount={selectedFiles.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <div className="flex">
        <Sidebar 
          currentFolder={currentFolder}
          onFolderSelect={setCurrentFolder}
        />
        
        <div className="flex-1 p-6">
          <div className="mb-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <button 
                onClick={() => setCurrentFolder('root')}
                className="hover:text-google-blue"
              >
                My Drive
              </button>
              {currentFolder !== 'root' && (
                <>
                  <span>/</span>
                  <span className="text-gray-900">{getCurrentFolderName()}</span>
                </>
              )}
            </nav>
          </div>
          
          <FileGrid
            files={files}
            viewMode={viewMode}
            selectedFiles={selectedFiles}
            onSelectionChange={setSelectedFiles}
            onFileClick={handleFolderClick}
            onRename={handleRenameFile}
            onDownload={handleDownloadFile}
            onDelete={handleDeleteFiles}
          />
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal
          onClose={() => setShowCreateFolderModal(false)}
          onCreate={handleCreateFolder}
        />
      )}
    </div>
  )
}
