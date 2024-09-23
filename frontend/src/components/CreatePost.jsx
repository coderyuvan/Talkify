import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { readFileAsDataURL } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const {posts}=useSelector(store=>store.post);
    const {user}=useSelector(store=>store.auth);
    const dispatch=useDispatch()
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async () => {
        const formData = new FormData();
        formData.append("caption", caption);
        if (imagePreview) formData.append("image", file);

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:4005/api/v1/posts/addPost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setPosts([res.data.post,...posts]));
                toast.success(res.data.message);
                setOpen(false);
                setCaption("");
                setImagePreview("");
                setFile("");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src="" alt="User Avatar" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>username</h1>
                        <span className='text-gray-600 text-xs'>Bio here...</span>
                    </div>
                </div>
                <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="focus-visible:ring-transparent border-none"
                    placeholder="Write a caption..."
                />
                {imagePreview && (
                    <div className='w-full h-auto flex items-center justify-center'>
                        <img src={imagePreview} alt="Preview" className='object-cover h-64 w-full rounded-md' />
                    </div>
                )}
                <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
                <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>Select from computer</Button>
                {imagePreview && (
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={createPostHandler} type="button" className="w-full">Post</Button>
                    )
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreatePost;
