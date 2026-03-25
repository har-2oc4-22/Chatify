import React from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function SenderMessage({ image, message }) {
  const { userData } = useSelector(state => state.user)

  return (
    <div className='flex items-end justify-end gap-2 group'>
      <div className='flex flex-col items-end gap-1 max-w-[72%]'>
        {message && (
          <div
            className='px-5 py-3 rounded-2xl rounded-br-sm text-white text-sm font-medium leading-relaxed tracking-wide shadow-lg'
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)'
            }}
          >
            {message}
          </div>
        )}
        {image && (
          <img
            src={image}
            alt="sent"
            className='max-w-[260px] rounded-2xl rounded-br-sm object-cover shadow-xl'
            style={{ border: '2px solid rgba(124,58,237,0.3)' }}
          />
        )}
      </div>
      <img
        src={userData?.image || dp}
        alt=""
        className='w-8 h-8 rounded-full object-cover shrink-0 mb-1'
        style={{ border: '2px solid rgba(124,58,237,0.5)' }}
      />
    </div>
  )
}

export default SenderMessage
