import React, { useRef, useState } from 'react'
import dp from "../assets/dp.webp"
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import { APP_NAME } from '../constants/branding';
function Profile() {
    let {userData}=useSelector(state=>state.user)
    let dispatch=useDispatch()
    let navigate=useNavigate()
let [name,setName]=useState(userData.name || "")
let [frontendImage,setFrontendImage]=useState(userData.image || dp)
let [backendImage,setBackendImage]=useState(null)
let image=useRef()
let [saving,setSaving]=useState(false)
const handleImage=(e)=>{
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
}

const handleProfile=async (e)=>{
   
e.preventDefault()
setSaving(true)
try {

    let formData=new FormData()
    formData.append("name",name)
    if(backendImage){
        formData.append("image",backendImage) 
    }
    let result=await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
    setSaving(false)
    dispatch(setUserData(result.data))
    navigate("/")
} catch (error) {
    console.log(error)
    setSaving(false)
}
}
  return (
    <div className='w-full min-h-screen bg-[#0F172A] flex flex-col justify-center items-center gap-[20px] px-4'>
        <div className='fixed top-[20px] left-[20px] cursor-pointer' onClick={()=>navigate("/")}>
        <IoIosArrowRoundBack className='w-[50px] h-[50px] text-slate-200'/>
        </div>
        <h1 className='text-3xl font-bold text-slate-100'>{APP_NAME} Profile</h1>
     <div className='bg-slate-800 rounded-full border-4 border-[#6366F1] shadow-lg relative' onClick={()=>image.current.click()}>
<div className='w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center'>
<img src={frontendImage} alt="" className='h-[100%]'/>
</div>
<div className='absolute bottom-4 text-white right-4 w-[35px] h-[35px] rounded-full bg-[#6366F1] flex justify-center items-center shadow-lg'>
<IoCameraOutline className='w-[25px] h-[25px]'/>
</div>
     </div>
     <form className='w-full max-w-[500px] card p-6 flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>
        <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
        <input type="text" placeholder="Enter your name" className='w-full h-[50px] outline-none px-[20px] py-[10px] input-modern text-[17px]' onChange={(e)=>setName(e.target.value)} value={name}/>
        <input type="text"  readOnly className='w-full h-[50px] outline-none px-[20px] py-[10px] input-modern text-slate-400 text-[17px]' value={userData?.userName}/>
        <input type="email" readOnly className='w-full h-[50px] outline-none px-[20px] py-[10px] input-modern text-slate-400 text-[17px]' value={userData?.email}/>
        <button className='px-[20px] py-[10px] btn-primary text-[20px] w-full mt-[12px] font-semibold transition-colors' disabled={saving}>{saving?"Saving...":"Save Profile"}</button>
     </form>
    </div>
  )
}

export default Profile
