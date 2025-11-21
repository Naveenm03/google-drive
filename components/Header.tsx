'use client'

import { Upload, FolderPlus, Trash2, Grid, List, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth'
import { useAuth } from './AuthProvider'

interface HeaderProps {
  onUpload: () => void
  onCreateFolder: () => void
  onDelete: () => void
  selectedCount: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export function Header({ 
  onUpload, 
  onCreateFolder, 
  onDelete, 
  selectedCount,
  viewMode,
  onViewModeChange 
}: HeaderProps) {
  const { user, setUser } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-6 h-6 bg-google-blue rounded"></div>
              <div className="w-6 h-6 bg-google-red rounded"></div>
              <div className="w-6 h-6 bg-google-yellow rounded"></div>
              <div className="w-6 h-6 bg-google-green rounded"></div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">GGLDrive</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onUpload}
              className="btn-primary flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            
            <button
              onClick={onCreateFolder}
              className="btn-secondary flex items-center space-x-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>

            {selectedCount > 0 && (
              <button
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-google-blue text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-google-blue text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
            <div className="text-sm text-gray-600">
              {user?.attributes?.email || user?.username}
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
