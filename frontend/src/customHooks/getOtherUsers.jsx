import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers } from "../redux/userSlice"
import { setToast } from "../redux/toastSlice"

const getOtherUsers=()=>{
    let dispatch=useDispatch()
    let {userData}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUsers=async ()=>{
            // Only fetch if user is logged in
            if(!userData) return;
            try {
                let result=await axios.get(`${serverUrl}/api/user/others`,{withCredentials:true})
                dispatch(setOtherUsers(result.data))
            } catch (error) {
                console.error("Failed to fetch users:", error.message)
                const errorMessage = error.response?.data?.message || "Failed to load contacts"
                dispatch(setToast({ message: errorMessage, type: "error" }))
            }
        }
        fetchUsers()
    },[userData, dispatch])
}

export default getOtherUsers