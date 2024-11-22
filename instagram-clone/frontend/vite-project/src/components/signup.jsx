import React from 'react'
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useState } from 'react'
import Login from './login'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'
const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
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
      setLoading(false);
    }
  }
  return (
    <div className='flex items-center h-screen w-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4 '>
          <h1 className='font-bold text-center'>LOGO</h1>
          <p>Signup to see your profile!</p>
          <span className='font-medium'>Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2" />
          <span className='font-medium'>Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2" />
          <span className='font-medium'>Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2" />
          {loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit">Signup</Button>
          )}
          <span className='text-center '>Already have an account? <Link to='/login' className='text-blue-600'>Sign-in</Link></span>
        </div>
      </form>
    </div>
  )
}

export default Signup