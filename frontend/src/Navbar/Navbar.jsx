import React from 'react'
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  return (
   <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <Link to={"/"}>
        <h2 className="text-xl font-medium text_blue py-2">
          <span className="text-blue-500">Aereo Assignment</span>
          <span className="text-slate-900">📝</span>
        </h2>
        </Link>
      
    </div>
  )
}
export default Navbar
