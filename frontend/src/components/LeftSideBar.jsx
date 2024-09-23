import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Avatar,AvatarFallback,AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authslice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
 
const LeftSidebar = () => {
    const navigate = useNavigate();
    const {user}=useSelector(store=>store.auth)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
 

    const logoutHandler = async () => {
        
        try {
            const res = await axios.get('http://localhost:4005/api/v1/users/logout', { withCredentials: true });
            console.log(res);
            
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
             logoutHandler();
            return ;
        } 
        else if (textType === "Create") {
            setOpen(true);
        } 
    }
    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]
  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                    </div>
                                    )
                                })
                            }
                                </div>
                                </div>
                                <CreatePost open={open} setOpen={setOpen}/>
                                </div>
                                 

  )
 
}

export default LeftSidebar