import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'

const Layout=()=> {
  return (
    <div>
      <LeftSideBar/>
    <div>
        <Outlet/>
    </div>
    </div>
  )
}

export default Layout