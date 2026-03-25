import React, { useRef, useState } from 'react'
import dp from "../assets/dp.webp"
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import { setToast } from '../redux/toastSlice';

function Profile() {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState(userData?.name || "")
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp)
  const [backendImage, setBackendImage] = useState(null)
  const image = useRef()
  const [saving, setSaving] = useState(false)

  const handleImage = (e) => {
    let file = e.target.files[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let formData = new FormData()
      formData.append("name", name)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      let result = await axios.put(`${serverUrl}/api/user/profile`, formData, { withCredentials: true })
      setSaving(false)
      dispatch(setUserData(result.data))
      dispatch(setToast({ message: "Profile updated! ✨", type: "success" }))
      navigate("/")
    } catch (error) {
      console.log(error)
      setSaving(false)
      dispatch(setToast({ message: "Failed to update profile", type: "error" }))
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
    color: 'white'
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center relative overflow-hidden font-sans p-4 w-full' style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Glowing background orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', animationDelay: '2s' }}></div>

      {/* Back Button */}
      <div
        className='absolute top-8 left-8 z-50 rounded-full p-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 group'
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack className='w-8 h-8 transition-colors' style={{ color: 'rgba(255,255,255,0.8)' }} />
      </div>

      <div className='w-full max-w-md relative z-10 p-10 flex flex-col items-center'
        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
        
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>Your Profile</h1>
          <p className='font-medium mt-1' style={{ color: 'rgba(255,255,255,0.5)' }}>Update your presence on <span className='font-bold' style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chatify</span></p>
        </div>

        {/* Avatar Section */}
        <div
          className='relative cursor-pointer group mb-10'
          onClick={() => image.current.click()}
        >
          <div className='w-40 h-40 rounded-full overflow-hidden relative p-[3px]' style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 10px 30px rgba(124,58,237,0.4)' }}>
            <img
              src={frontendImage}
              alt="Avatar"
              className='w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110'
              style={{ border: '4px solid #1a1a2e' }}
            />
            {/* Overlay */}
            <div className='absolute inset-[3px] rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
              <IoCameraOutline className='text-white w-9 h-9 drop-shadow-md' />
            </div>
          </div>

          <div className='absolute bottom-1 right-1 text-white p-2.5 rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform' style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: '3px solid #1a1a2e' }}>
            <IoCameraOutline className='w-5 h-5' />
          </div>
        </div>

        <form className='w-full flex flex-col gap-5' onSubmit={handleProfile}>
          <input type="file" accept='image/*' ref={image} hidden onChange={handleImage} />

          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold uppercase tracking-widest ml-1' style={{ color: 'rgba(255,255,255,0.4)' }}>Display Name</label>
            <input
              type="text"
              placeholder="How should we call you?"
              className='w-full outline-none px-5 py-3.5 rounded-xl font-semibold transition-all placeholder:text-white/30'
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.7)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className='flex flex-col gap-1.5 opacity-60 cursor-not-allowed'>
            <label className='text-xs font-bold uppercase tracking-widest ml-1' style={{ color: 'rgba(255,255,255,0.4)' }}>Username</label>
            <div className='w-full px-5 py-3.5 rounded-xl font-medium' style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
              @{userData?.userName}
            </div>
          </div>

          <div className='flex flex-col gap-1.5 opacity-60 cursor-not-allowed'>
            <label className='text-xs font-bold uppercase tracking-widest ml-1' style={{ color: 'rgba(255,255,255,0.4)' }}>Email Address</label>
            <div className='w-full px-5 py-3.5 rounded-xl font-medium' style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
              {userData?.email}
            </div>
          </div>

          <button
            type="submit"
            className='w-full mt-4 py-4 text-white rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100'
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: saving ? 'none' : '0 10px 25px rgba(6,182,212,0.3)' }}
            disabled={saving}
          >
            {saving ? (
              <div className='flex items-center justify-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </div>
            ) : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
