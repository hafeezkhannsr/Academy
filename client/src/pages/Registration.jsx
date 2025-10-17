import React, { useState } from 'react'
import axios from 'axios'

export default function Registration(){
  const [form, setForm] = useState({})
  const [courses, setCourses] = useState([])

  function handleChange(e){
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  async function handleSubmit(e){
    e.preventDefault()
    try{
      await axios.post(`${API}/api/register`, form)
      alert('Registered')
    }catch(err){
      alert('Error: ' + err.message)
    }
  }

  useEffect(()=>{
    axios.get(`${API}/api/courses`).then(r=>setCourses(r.data)).catch(()=>{})
  }, [])

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Full Name*</label>
        <input name="fullName" onChange={handleChange} required />

        <label>Father's Name*</label>
        <input name="fatherName" onChange={handleChange} required />

        <label>Course Name*</label>
        <select name="courseId" onChange={handleChange} required>
          <option value="">Select Course</option>
          {courses.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <label>Roll Number*</label>
        <input name="rollNumber" onChange={handleChange} required />

        <label>ID Type*</label>
        <select name="idType" onChange={handleChange} required>
          <option value="">Select</option>
          <option value="nic">NIC</option>
          <option value="formB">Form-B</option>
        </select>

        <label>ID Number*</label>
        <input name="idNumber" onChange={handleChange} required />

        <label>Contact Number*</label>
        <input name="contactNumber" onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
