import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice'
import { APP_NAME } from '../constants/branding'

function Login() {
    let navigate=useNavigate()
    let [show,setShow]=useState(false)
    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    let [loading,setLoading]=useState(false)
    let [err,setErr]=useState("")
    let dispatch=useDispatch()
    
        const handleLogin=async (e)=>{
            e.preventDefault()
            setLoading(true)
            try {
                let result =await axios.post(`${serverUrl}/api/auth/login`,{
    email,password
                },{withCredentials:true})
               dispatch(setUserData(result.data))
               dispatch(setSelectedUser(null))
               navigate("/")
                setEmail("")
                setPassword("")
                setLoading(false)
                setErr("")
            } catch (error) {
                console.log(error)
                setLoading(false)
                setErr(error.response.data.message)
            }
        }
    
  return (
    <div className='w-full min-h-screen bg-[#0F172A] flex items-center justify-center px-4'>
     <div className='w-full max-w-[500px] card p-6 sm:p-8 flex flex-col gap-8'>
        <div className='w-full rounded-[16px] bg-[#6366F1] shadow-lg flex items-center justify-center py-10 px-4'>
           <h1 className='text-slate-100 font-bold text-3xl text-center'>Login to <span className='text-white'>{APP_NAME}</span></h1>
        </div>
        <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleLogin}>
        <input type="email" placeholder='Email' className='w-full h-[52px] outline-none px-[20px] py-[10px] input-modern text-[17px]' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        <div className='w-full h-[52px] overflow-hidden input-modern relative'>
        <input type={`${show?"text":"password"}`} placeholder='Password' className='w-full h-full outline-none px-[20px] py-[10px] bg-transparent text-[17px]' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        <span className='absolute top-[12px] right-[20px] text-[15px] text-[#22C55E] font-semibold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{`${show?"hide":"show"}`}</span>
        </div>
{err && <p className='text-red-500'>{"*" + err}</p>}
        <button className='px-[20px] py-[12px] btn-primary text-[18px] w-full mt-[6px] font-semibold transition-colors' disabled={loading}>{loading?"Loading...":"Login"}</button>
        <p className='cursor-pointer text-slate-300 text-center' onClick={()=>navigate("/signup")}>Want to create a new account? <span className='text-[#22C55E] font-semibold'>Sign up</span></p>
     </form>
     </div>
     
    </div>
  )
}

export default Login
