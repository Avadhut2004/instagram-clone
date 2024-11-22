import React from 'react'
import Leftsidebar from './Leftsidebar'
import Home from './Home'

const MainLayout = () => {
  return (
    <div className='flex flex-1 items-start min-h-screen w-full'>
      {/* Sidebar */}
      <Leftsidebar />
      <hr/>

      {/* Main Content */}
      <div className='flex-grow'>
        <Home />
      </div>
    </div>
  )
}

export default MainLayout
