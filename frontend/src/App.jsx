import {BrowserRouter,Routes,Route} from 'react-router-dom'
import React from 'react'
import Navbar from './Navbar/Navbar'
import Home from './Home/Home'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
    </BrowserRouter>
  )
  
}

export default App
