import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard(){
  const [students, setStudents] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  useEffect(()=>{
    if (!token) return
    axios.get(`${API}/api/students`, { headers: { Authorization: 'Bearer ' + token } }).then(r=>setStudents(r.data)).catch(()=>{})
  },[])

  const courseCounts = students.reduce((acc, s)=>{
    acc[s.courseName] = (acc[s.courseName] || 0) + 1
    return acc
  }, {})

  const data = {
    labels: Object.keys(courseCounts),
    datasets: [
      {
        label: 'Students per course',
        data: Object.values(courseCounts),
        backgroundColor: 'rgba(75,192,192,0.4)'
      }
    ]
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <Bar data={data} />
      <h2>Students ({students.length})</h2>
      <table>
        <thead><tr><th>Name</th><th>Course</th><th>Roll</th></tr></thead>
        <tbody>
          {students.map(s=>(<tr key={s._id}><td>{s.fullName}</td><td>{s.courseName}</td><td>{s.rollNumber}</td></tr>))}
        </tbody>
      </table>
    </div>
  )
}
