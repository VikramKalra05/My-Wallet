import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import BlankPage from '../pages/BlankPage'

const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} ></Route>
        <Route path='/*' element={<BlankPage />} ></Route>
        <Route path='/register' element={<Register />} ></Route>
        <Route path='/login' element={<Login />} ></Route>
    </Routes>
  )
}

export default AllRoutes