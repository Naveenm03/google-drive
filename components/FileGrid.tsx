'use client'

import { useState } from 'react'
import { FileItem } from '@/lib/file-storage'
import { FileCard } from './FileCard'
import { FileList } from './FileList'
import { 
  Folder, 
  File, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  FileSpreadsheet,
  FileCode
} from 'lucide-react'

interface FileGridProps {
  files: FileItem[]
  viewMode: 'grid' | 'list'
  selectedFiles: string[]
  onSelectionChange: (selected: string[]) => void
  onFileClick: (file: FileItem) => void
  onRename: (id: string, newName: string) => void
  onDownload: (file: FileItem) => void
  onDelete: (fileIds: string[]) => void
}

export function FileGrid({ 
  files, 
  viewMode, 
  selectedFiles, 
  onSelectionChange,
  onFileClick,
  onRename,
  onDownload,
  onDelete
}: FileGridProps) {
  const [renamingFile, setRenamingFile] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return Folder
    
    const mimeType = file.mimeType || ''
    
    if (mimeType.startsWith('image/')) return Image
    if (mimeType.startsWith('video/')) return Video
    if (mimeType.startsWith('audio/')) return Music
    if (mimeType.includes('pdf')) return FileText
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet
    if (mimeType.includes('zip') || mimeType.includes('rar')) return Archive
    if (mimeType.includes('text') || mimeType.includes('code')) return FileCode
    
    return File
  }

  const handleFileSelect = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange([...selectedFiles, fileId])
    } else {
      onSelectionChange(selectedFiles.filter(id => id !== fileId))
    }
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(files.map(f => f.id))
    }
  }

  const handleRename = (file: FileItem) => {
    setRenamingFile(file.id)
    setRenameValue(file.name)
  }

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renamingFile) {
      onRename(renamingFile, renameValue.trim())
    }
    setRenamingFile(null)
    setRenameValue('')
  }

  const handleRenameCancel = () => {
    setRenamingFile(null)
    setRenameValue('')
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Folder className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">No files yet</h3>
        <p className="text-sm">Upload files or create folders to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFiles.length === files.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
              />
              <span className="text-sm text-gray-600">
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} selected` 
                  : 'Select all'
                }
              </span>
            </label>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {files.map((file) => {
            const Icon = getFileIcon(file)
            const isSelected = selectedFiles.includes(file.id)
            const isRenaming = renamingFile === file.id

            return (
              <div
                key={file.id}
                className={`file-item ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => !isRenaming && onFileClick(file)}
              >
                <div className="flex flex-col items-center p-4">
                  <div className="relative">
                    <Icon className="w-12 h-12 text-gray-600 mb-2" />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-google-blue rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  {isRenaming ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit()
                        if (e.key === 'Escape') handleRenameCancel()
                      }}
                      className="text-sm text-center bg-white border border-gray-300 rounded px-2 py-1 w-full"
                      autoFocus
                    />
                  ) : (
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-900 truncate w-full">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {file.type === 'file' ? formatFileSize(file.size) : 'Folder'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(file.modifiedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Modified</div>
            <div className="col-span-2">Actions</div>
          </div>
          {files.map((file) => {
            const Icon = getFileIcon(file)
            const isSelected = selectedFiles.includes(file.id)
            const isRenaming = renamingFile === file.id

            return (
              <div
                key={file.id}
                className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <div className="col-span-6 flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleFileSelect(file.id, e.target.checked)}
                    className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
                  />
                  <Icon className="w-5 h-5 text-gray-600" />
                  {isRenaming ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit()
                        if (e.key === 'Escape') handleRenameCancel()
                      }}
                      className="flex-1 bg-white border border-gray-300 rounded px-2 py-1"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {file.type === 'file' ? formatFileSize(file.size) : 'Folder'}
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {formatDate(file.modifiedAt)}
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  {!isRenaming && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRename(file)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        title="Rename"
                      >
                        ✏️
                      </button>
                      {file.type === 'file' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDownload(file)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Download"
                        >
                          ⬇️
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete([file.id])
                        }}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
