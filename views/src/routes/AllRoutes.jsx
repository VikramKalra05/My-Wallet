import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import BlankPage from '../pages/BlankPage'
import Dashboard from '../pages/Dashboard'
import Records from '../pages/RecordsPage'
import PrivateRoutes from './PrivateRoutes'
import Analytics from "../pages/Analytics"
import Accounts from "../pages/Accounts"
import Settings from '../pages/Settings'
import Logout from '../pages/Logout'

const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} ></Route>
        <Route path='/*' element={<BlankPage />} ></Route>
        <Route path='/login' element={<Login />} ></Route>
        <Route path='/register' element={<Register />} ></Route>
        <Route path='/logout' element={<Logout />} ></Route>
        
        <Route element={<PrivateRoutes />}>
        <Route path="/accounts" element={<Accounts />} />
          <Route path="/records" element={<Records />} />
          <Route path="/analytics"element={<Analytics />}/>
          <Route path='/dashboard' element={<Dashboard />} ></Route>
          <Route path='/settings' element={<Settings />} ></Route>

        </Route>
    </Routes>
  )
}

export default AllRoutes