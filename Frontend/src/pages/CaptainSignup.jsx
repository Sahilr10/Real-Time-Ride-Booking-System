import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const CaptainSignup = () => {
  const[username, setUsername] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const [userData, setUserData] = useState({
      username: '',
      email: '',
      password: ''
    })
  
    const submitHandler = (e) => {
      e.preventDefault()
      setUserData({
        username: username,
        email: email,
        password: password
      })
  
      setEmail('')
      setPassword('')
      setUsername('')
    }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
              
              <div>
                 <img className='w-16 mb-10' src="https://www.pngall.com/wp-content/uploads/4/Uber-Logo-PNG-Free-Image.png" alt="" />
        
              <form onSubmit={(e)=> {
                submitHandler(e)
              }}>
        
                <h3 className='text-lg font-medium mb-2 '>What's your username</h3>
        
                <input 
                required 
                className='bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                type="text" 
                placeholder='username'
                value={username}
                onChange={(e)=>{
                  setUsername(e.target.value)
                }}
                />
    
                <h3 className='text-lg font-medium mb-2 '>What's your email</h3>
        
                <input 
                required 
                className='bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                type="email" 
                placeholder='email@example.com'
                value={email}
                onChange={(e)=>{
                  setEmail(e.target.value)
                }}
                />
        
                <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
        
                <input 
                required 
                className='bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                type="password" 
                placeholder='password'
                value={password}
                onChange={(e)=>{
                  setPassword(e.target.value)
                }}
                />
        
                <button
                className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base'
                >
                  SignUp
                </button>
        
              </form>
        
                <p className='text-center'>Already have a account? <Link  to='/captain-login' className='text-blue-600'>Login</Link></p>
                
              </div>
        
              <div>
                <p className='text-[10px] leading-tight'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea velit tempore consequatur in consequuntur nostrum impedit neque aspernatur minima, doloremque, eligendi, a molestias fuga excepturi quas perferendis suscipit delectus corporis?</p>
              </div>
        
            </div>
  )
}

export default CaptainSignup
