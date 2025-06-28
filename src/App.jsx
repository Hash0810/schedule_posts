import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from "./Register";
import Login from "./Login";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="flex justify-center space-x-4 py-4 bg-white shadow">
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
