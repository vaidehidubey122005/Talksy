import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import getMessage from '../customHooks/getMessages'


function Home() {
 getMessage()
  return (
    <div className='w-full min-h-screen flex bg-[#0F172A]'>
     <SideBar/>
     <MessageArea/>
    </div>
  )
}

export default Home
