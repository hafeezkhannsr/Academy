import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function login(e){
    e.preventDefault()
    try{
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const r = await axios.post(`${API}/auth/login`, { email, password })
      localStorage.setItem('token', r.data.token)
      nav('/admin')
    }catch(err){
      alert('Login failed')
    }
  }

  return (
    <div className="container">
      <h1>Admin Login</h1>
      <form onSubmit={login}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
