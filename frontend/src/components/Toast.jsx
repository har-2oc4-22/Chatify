import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearToast } from '../redux/toastSlice'

/**
 * Toast notification component.
 * Reads from Redux toast slice and auto-dismisses after 3 seconds.
 * Supports: success (green), error (red), info (blue)
 */
function Toast() {
    const dispatch = useDispatch()
    const { message, type } = useSelector(state => state.toast)

    useEffect(() => {
        if (!message) return
        const timer = setTimeout(() => dispatch(clearToast()), 3000)
        return () => clearTimeout(timer)
    }, [message, dispatch])

    if (!message) return null

    const styles = {
        success: {
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.4)',
            color: '#6ee7b7',
            icon: '✅'
        },
        error: {
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#fca5a5',
            icon: '❌'
        },
        info: {
            background: 'rgba(6,182,212,0.15)',
            border: '1px solid rgba(6,182,212,0.4)',
            color: '#67e8f9',
            icon: 'ℹ️'
        }
    }

    const s = styles[type] || styles.info

    return (
        <div
            className='fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm max-w-sm shadow-2xl animate-fade-in-up'
            style={{
                background: s.background,
                border: s.border,
                color: s.color,
                backdropFilter: 'blur(16px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
        >
            <span className='text-base'>{s.icon}</span>
            <span>{message}</span>
            <button
                onClick={() => dispatch(clearToast())}
                className='ml-auto opacity-60 hover:opacity-100 transition-opacity text-lg leading-none'
            >
                ×
            </button>
        </div>
    )
}

export default Toast
