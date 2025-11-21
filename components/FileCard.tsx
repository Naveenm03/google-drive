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

interface FileCardProps {
  file: FileItem
  isSelected: boolean
  isRenaming: boolean
  renameValue: string
  onSelect: (isSelected: boolean) => void
  onClick: () => void
  onRename: (newName: string) => void
  onRenameCancel: () => void
  onDownload?: () => void
  onDelete?: () => void
}

export function FileCard({
  file,
  isSelected,
  isRenaming,
  renameValue,
  onSelect,
  onClick,
  onRename,
  onRenameCancel,
  onDownload,
  onDelete
}: FileCardProps) {
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

  const Icon = getFileIcon(file)

  return (
    <div
      className={`file-item ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
      onClick={onClick}
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
            onChange={(e) => onRename(e.target.value)}
            onBlur={() => onRename(renameValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onRename(renameValue)
              if (e.key === 'Escape') onRenameCancel()
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
}
