'use client'

import { Home, Star, Trash2, Clock, Folder } from 'lucide-react'
import { FileStorage } from '@/lib/file-storage'
import { useState, useEffect } from 'react'

interface SidebarProps {
  currentFolder: string
  onFolderSelect: (folderId: string) => void
}

export function Sidebar({ currentFolder, onFolderSelect }: SidebarProps) {
  const [recentFiles, setRecentFiles] = useState<any[]>([])

  useEffect(() => {
    // Get recent files (last 5 modified files)
    const allFiles = FileStorage.getFiles()
    const recent = allFiles
      .filter(file => file.type === 'file')
      .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
      .slice(0, 5)
    setRecentFiles(recent)
  }, [currentFolder])

  const menuItems = [
    { id: 'root', label: 'My Drive', icon: Home },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentFolder === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onFolderSelect(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-google-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {recentFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Files</h3>
          <div className="space-y-1">
            {recentFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => onFolderSelect(file.parentId || 'root')}
                className="w-full flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                <Folder className="w-4 h-4" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
