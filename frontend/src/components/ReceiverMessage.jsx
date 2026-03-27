import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
function ReceiverMessage({image,message}) {
  let scroll=useRef()
  let {selectedUser}=useSelector(state=>state.user)
  useEffect(()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  },[message,image])
  
  const handleImageScroll=()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  }
  return (
    <div className='flex items-start gap-[10px]' >
           <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-slate-800 cursor-pointer shadow-lg' >
         <img src={selectedUser.image || dp} alt="" className='h-[100%]'/>
         </div>
          <div ref={scroll} className='w-fit max-w-[85%] px-[18px] py-[10px] bg-slate-700 text-white text-[18px] rounded-tl-none rounded-[14px] relative left-0 shadow-lg gap-[10px] flex flex-col'>
        {image &&  <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll}/>}
       {message && <span >{message}</span>}
       </div>
     
        </div>
  )
}

export default ReceiverMessage
