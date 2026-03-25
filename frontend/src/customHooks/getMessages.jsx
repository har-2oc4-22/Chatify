import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/messageSlice"
import { setToast } from "../redux/toastSlice"

const getMessage=()=>{
    let dispatch=useDispatch()
    let {userData,selectedUser}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchMessages=async ()=>{
            // If no user is selected, don't fetch
            if(!selectedUser?._id) return;
            
            try {
                let result=await axios.get(`${serverUrl}/api/message/${selectedUser._id}`,{withCredentials:true})
                dispatch(setMessages(result.data))
            } catch (error) {
                console.error("Failed to fetch messages:", error)
                const errorMessage = error.response?.data?.message || "Failed to load messages"
                dispatch(setToast({ message: errorMessage, type: "error" }))
            }
        }
        fetchMessages()
    },[selectedUser,userData, dispatch])
}

export default getMessage