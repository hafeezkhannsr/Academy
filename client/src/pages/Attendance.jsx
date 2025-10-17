import React, { useState } from 'react'
import axios from 'axios'

export default function Attendance(){
  const [studentId, setStudentId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [courses, setCourses] = useState([])
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  async function mark(){
    try{
      await axios.post('http://localhost:4000/api/attendance', { studentId, courseId, date })
      alert('Marked')
    }catch(err){
      alert(err.message)
    }
  }

  useEffect(()=>{
    axios.get(`${API}/api/courses`).then(r=>setCourses(r.data)).catch(()=>{})
  }, [])

  return (
    <div className="container">
      <h1>Attendance</h1>
      <label>Student ID</label>
      <input value={studentId} onChange={e=>setStudentId(e.target.value)} />

      <label>Course</label>
      <select value={courseId} onChange={e=>setCourseId(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      <label>Date</label>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} />

  <button onClick={mark}>Mark</button>
    </div>
  )
}
