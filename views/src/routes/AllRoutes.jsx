import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import BlankPage from '../pages/BlankPage'
import Dashboard from '../pages/Dashboard'
import Records from '../pages/Records'
import PrivateRoutes from './PrivateRoutes'

const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} ></Route>
        <Route path='/*' element={<BlankPage />} ></Route>
        <Route path='/register' element={<Register />} ></Route>
        <Route path='/login' element={<Login />} ></Route>
        
        <Route element={<PrivateRoutes />}>
          <Route path='/transaction/records' element={<Records />} ></Route>
          <Route path="/records" element={<Records />} />
          <Route path='/dashboard' element={<Dashboard />} ></Route>
        </Route>
    </Routes>
  )
}

export default AllRoutes