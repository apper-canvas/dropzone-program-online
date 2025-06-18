import { Outlet } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="flex-shrink-0 h-16 bg-surface-800 border-b border-surface-700 z-40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-white">DropZone</h1>
          </div>
          <div className="text-sm text-gray-400">
            Upload files with ease
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout