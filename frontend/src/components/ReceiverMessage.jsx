import React from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function ReceiverMessage({ image, message }) {
  const { selectedUser } = useSelector(state => state.user)

  return (
    <div className='flex items-end justify-start gap-2 group'>
      <img
        src={selectedUser?.image || dp}
        alt=""
        className='w-8 h-8 rounded-full object-cover shrink-0 mb-1'
        style={{ border: '2px solid rgba(6,182,212,0.4)' }}
      />
      <div className='flex flex-col items-start gap-1 max-w-[72%]'>
        {message && (
          <div
            className='px-5 py-3 rounded-2xl rounded-bl-sm text-sm font-medium leading-relaxed tracking-wide'
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            {message}
          </div>
        )}
        {image && (
          <img
            src={image}
            alt="received"
            className='max-w-[260px] rounded-2xl rounded-bl-sm object-cover shadow-xl'
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          />
        )}
      </div>
    </div>
  )
}

export default ReceiverMessage
