import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../constants/branding';
function SideBar() {
    let {userData,otherUsers,selectedUser,onlineUsers,searchData} = useSelector(state=>state.user)
    let [search,setSearch]=useState(false)
    let [input,setInput]=useState("")
let dispatch=useDispatch()
let navigate=useNavigate()
    const handleLogOut=async ()=>{
        try {
            let result =await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
dispatch(setUserData(null))
dispatch(setOtherUsers(null))
navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handlesearch=async ()=>{
        try {
            let result =await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
            dispatch(setSearchData(result.data))
           
        }
        catch(error){
console.log(error)
        }
    }

    useEffect(()=>{
        if(input){
            handlesearch()
        }

    },[input])
  return (
    <div className={`lg:w-[32%] w-full h-full overflow-hidden lg:block bg-[#0F172A] relative border-r border-slate-700 ${!selectedUser?"block":"hidden"}`}>
        <div className='w-[56px] h-[56px] rounded-[16px] overflow-hidden flex justify-center items-center bg-[#6366F1] text-white cursor-pointer shadow-lg fixed bottom-[16px] left-[12px] z-20' onClick={handleLogOut}>
   <BiLogOutCircle className='w-[25px] h-[25px]'/>
</div>
{input.length>0 && <div className='flex absolute top-[235px] bg-slate-900 w-full h-[calc(100%-235px)] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-lg'>
{searchData?.map((user)=>(
     <div className='w-[95%] min-h-[70px] flex items-center gap-[20px] px-[12px] py-2 hover:bg-slate-700 border-b border-slate-700 cursor-pointer rounded-[12px]' onClick={()=>{
        dispatch(setSelectedUser(user))
        setInput("")
        setSearch(false)
     }
        }>
     <div className='relative rounded-full bg-slate-800 flex justify-center items-center'>
     <div className='w-[60px] h-[60px]   rounded-full overflow-hidden flex justify-center items-center '>
     <img src={user.image || dp} alt="" className='h-[100%]'/>
     </div>
     {onlineUsers?.includes(user._id) &&
     <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#22C55E] shadow-md'></span>}
     </div>
     <h1 className='text-slate-100 font-semibold text-[20px]'>{user.name || user.userName}</h1>
     </div>
))}
        </div> }

      <div className='w-full h-[280px] bg-slate-900 shadow-lg flex flex-col justify-center px-[20px] gap-3 rounded-b-[24px]'>
    <h1 className='text-slate-100 font-bold text-[28px]'>{APP_NAME}</h1>
   <div className='w-full flex justify-between items-center'>
    <h1 className='text-slate-200 font-semibold text-[24px]'>Hi, {userData.name || "user"}</h1>
    <div className='w-[56px] h-[56px] rounded-full overflow-hidden flex justify-center items-center bg-slate-800 cursor-pointer shadow-lg' onClick={()=>navigate("/profile")}>
<img src={userData.image || dp} alt="" className='h-[100%]'/>
</div>
   </div>
   <div className='w-full  flex items-center gap-[20px] overflow-y-auto py-[18px]'>
    {!search && <div className='w-[56px] h-[56px] mt-[10px] rounded-[16px] overflow-hidden flex justify-center items-center bg-[#6366F1] text-white cursor-pointer shadow-lg' onClick={()=>setSearch(true)}>
   <IoIosSearch className='w-[24px] h-[24px]'/>
</div>}

{search && 
    <form className='w-full h-[56px] input-modern shadow-lg flex items-center gap-[10px] mt-[10px] px-[20px] relative'>
    <IoIosSearch className='w-[22px] h-[22px] text-slate-200'/>
    <input type="text" placeholder='Search users...' className='w-full h-full p-[10px] text-[17px] outline-none border-0 bg-transparent text-slate-100 placeholder:text-slate-400' onChange={(e)=>setInput(e.target.value)} value={input}/>
    <RxCross2 className='w-[22px] h-[22px] cursor-pointer text-slate-200' onClick={()=>setSearch(false)}/>
     
    </form>
    }
{!search && otherUsers?.map((user)=>(
    onlineUsers?.includes(user._id) &&
    <div className='relative rounded-full bg-slate-800 shadow-lg flex justify-center items-center mt-[10px] cursor-pointer' onClick={()=>dispatch(setSelectedUser(user))}>
    <div className='w-[60px] h-[60px]   rounded-full overflow-hidden flex justify-center items-center '>
    <img src={user.image || dp} alt="" className='h-[100%]'/>
    </div>
    <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#22C55E] shadow-md'></span>
    </div>
))}
 
   </div>
      </div>

      <div className='w-full h-[50%] overflow-auto flex flex-col gap-[14px] items-center mt-[18px] px-2 pb-4'>
{otherUsers?.map((user)=>(
    <div className='w-[95%] min-h-[64px] flex items-center gap-[16px] px-2 shadow-lg bg-slate-800 rounded-[14px] hover:bg-slate-700 cursor-pointer' onClick={()=>dispatch(setSelectedUser(user))}>
    <div className='relative rounded-full bg-slate-800 shadow-lg flex justify-center items-center'>
    <div className='w-[60px] h-[60px]   rounded-full overflow-hidden flex justify-center items-center '>
    <img src={user.image || dp} alt="" className='h-[100%]'/>
    </div>
    {onlineUsers?.includes(user._id) &&
    <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#22C55E] shadow-md'></span>}
    </div>
    <h1 className='text-slate-100 font-semibold text-[19px]'>{user.name || user.userName}</h1>
    </div>
))}
      </div>
    </div>
  )
}

export default SideBar