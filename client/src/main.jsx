import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registration from './pages/Registration'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import './styles.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registration/>} />
        <Route path="/attendance" element={<Attendance/>} />
        <Route path="/admin" element={<Dashboard/>} />
        <Route path="/login" element={<AdminLogin/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
