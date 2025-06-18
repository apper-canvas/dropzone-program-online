import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import FileSidebar from '@/components/molecules/FileSidebar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="flex-shrink-0 h-16 bg-surface-800 border-b border-surface-700 z-40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-white">DropZone</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700 transition-colors"
            >
              <ApperIcon name="Files" size={16} />
              <span className="text-sm">Files</span>
            </button>
            <div className="text-sm text-gray-400">
              Upload files with ease
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <FileSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout