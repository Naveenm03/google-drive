'use client'

import { FileItem } from '@/lib/file-storage'
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

interface FileListProps {
  files: FileItem[]
  selectedFiles: string[]
  onSelectionChange: (selected: string[]) => void
  onFileClick: (file: FileItem) => void
  onRename: (id: string, newName: string) => void
  onDownload: (file: FileItem) => void
  onDelete: (fileIds: string[]) => void
}

export function FileList({
  files,
  selectedFiles,
  onSelectionChange,
  onFileClick,
  onRename,
  onDownload,
  onDelete
}: FileListProps) {
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

  const handleFileSelect = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange([...selectedFiles, fileId])
    } else {
      onSelectionChange(selectedFiles.filter(id => id !== fileId))
    }
  }

  return (
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

        return (
          <div
            key={file.id}
            className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
              isSelected ? 'bg-blue-50' : ''
            }`}
            onClick={() => onFileClick(file)}
          >
            <div className="col-span-6 flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation()
                  handleFileSelect(file.id, e.target.checked)
                }}
                className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
              />
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </span>
            </div>
            <div className="col-span-2 text-sm text-gray-600">
              {file.type === 'file' ? formatFileSize(file.size) : 'Folder'}
            </div>
            <div className="col-span-2 text-sm text-gray-600">
              {formatDate(file.modifiedAt)}
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle rename
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
            </div>
          </div>
        )
      })}
    </div>
  )
}
