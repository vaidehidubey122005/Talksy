import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';
import { APP_NAME, APP_TAGLINE } from '../constants/branding';
function MessageArea() {
  let {selectedUser,userData,socket}=useSelector(state=>state.user)
  let dispatch=useDispatch()
  let [showPicker,setShowPicker]=useState(false)
let [input,setInput]=useState("")
let [frontendImage,setFrontendImage]=useState(null)
let [backendImage,setBackendImage]=useState(null)
let image=useRef()
let {messages}=useSelector(state=>state.message)
const handleImage=(e)=>{
  let file=e.target.files[0]
  setBackendImage(file)
  setFrontendImage(URL.createObjectURL(file))
    }
const handleSendMessage=async (e)=>{
  e.preventDefault()
  if(input.length==0 && backendImage==null){
    return 
  }
  try {
    let formData=new FormData()
    formData.append("message",input)
    if(backendImage){
      formData.append("image",backendImage)
    }
    let result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
    dispatch(setMessages([...messages,result.data]))
    setInput("")
    setFrontendImage(null)
    setBackendImage(null)
  } catch (error) {
    console.log(error)
  }
}
  const onEmojiClick =(emojiData)=>{
 setInput(prevInput=>prevInput+emojiData.emoji)
 setShowPicker(false)
  }
useEffect(()=>{
socket?.on("newMessage",(mess)=>{
  dispatch(setMessages([...messages,mess]))
})
return ()=>socket?.off("newMessage")
},[messages,setMessages])
 
  return (
    <div className={`lg:w-[68%] relative ${selectedUser?"flex":"hidden"} lg:flex w-full h-full bg-[#0F172A] overflow-hidden`}>
      
{selectedUser && 
<div className='w-full h-[100vh] flex flex-col overflow-hidden gap-[16px] items-center'>
<div className='w-full h-[92px] bg-slate-900 shadow-lg gap-[20px] flex items-center px-[20px] border-b border-slate-700'>
           <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}>
                  <IoIosArrowRoundBack className='w-[40px] h-[40px] text-white'/>
           </div>
         <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center bg-slate-800 cursor-pointer shadow-lg' >
        <img src={ selectedUser?.image || dp} alt="" className='h-[100%]'/>
        </div>
        <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || "user"}</h1>
    </div>

    <div className='w-full h-[70%] flex flex-col py-[20px] px-[20px] overflow-auto gap-[18px]'>

{showPicker && <div className='absolute bottom-[120px] left-[20px]'><EmojiPicker width={250} height={350} className='shadow-lg z-[100]' onEmojiClick={onEmojiClick}/></div> }

{messages && messages.map((mess)=>(
  mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>:<ReceiverMessage image={mess.image} message={mess.message}/>
))}
 

    </div>
    </div> 
    }
{selectedUser && <div className='w-full lg:w-[68%] h-[100px] fixed bottom-[10px] flex items-center justify-center px-2'>
      <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[88px] right-[20%] rounded-lg shadow-lg'/>
     <form className='w-[98%] lg:w-[95%] h-[60px] bg-slate-900 border border-slate-700 shadow-lg rounded-[16px] flex items-center gap-[16px] px-[16px] relative' onSubmit={handleSendMessage}>
      
       <div onClick={()=>setShowPicker(prev=>!prev)}>
       <RiEmojiStickerLine  className='w-[25px] h-[25px] text-slate-100 cursor-pointer'/>
       </div>
       <input type="file" accept="image/*" ref={image} hidden onChange={handleImage}/>
       <input type="text" className='w-full h-full px-[10px] outline-none border-0 text-[18px] text-slate-100 bg-transparent placeholder:text-slate-400' placeholder='Message' onChange={(e)=>setInput(e.target.value)} value={input}/>
<div onClick={()=>image.current.click()}>
<FaImages className='w-[25px] h-[25px] cursor-pointer text-slate-100'/>
</div>
{(input.length>0  ||  backendImage!=null) && (<button>
<RiSendPlane2Fill className='w-[25px] cursor-pointer h-[25px] text-[#22C55E]'/>
</button>)}

     </form>
     </div>}
    {!selectedUser && 
    <div className='w-full h-full flex flex-col justify-center items-center text-center px-4'>
    <h1 className='text-slate-100 font-bold text-[46px]'>Welcome to {APP_NAME}</h1>
    <span className='text-slate-400 font-semibold text-[24px]'>{APP_TAGLINE}!</span>
      </div>}
    


    </div>
  )
}

export default MessageArea