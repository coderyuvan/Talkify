import React,{useState} from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'sonner';
import axios from 'axios';
function Signup() {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading,setLoading]=useState(false)
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async(e)=>{
        e.preventDefault();
        console.log(input);
        
        try {
            setLoading(true)
            const res= await axios.post("http://localhost:4004/api/v1/users/register",input,{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(res.data.success){
                toast.success(res.data.message)
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        finally {
            setLoading(false)
        }
    }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
    <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
            <h1 className='text-center font-bold text-xl'>LOGO</h1>
            <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
        </div>
        <div>
            <span className='font-medium'>Username</span>
            <Input
                type="text"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
            />
        </div>
        <div>
            <span className='font-medium'>Email</span>
            <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
            />
        </div>
        <div>
            <span className='font-medium'>Password</span>
            <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
            />
        </div>
        
                <Button type='submit'>Signup</Button>
            
        
        <span className='text-center'>Already have an account?</span>
    </form>
</div>
  )
}

export default Signup