import { useContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './componenets/regitser/Register'
import Login from './componenets/login-auth/Login'
import NotFound from './NotFound'
import Track from './componenets/Track'
import { useNavigate } from 'react-router-dom'
import { UserContext } from './context/UserContext'
import Private from './componenets/Private'
import ForgetPassword from './componenets/login-auth/ForgetPassword'
import LoginOtp from './componenets/login-auth/LoginOtp'
import Diet from './componenets/Diet'

function App() {
  const [loggedUser,setLoggedUser] = useState(JSON.parse(localStorage.getItem("token")));
  // const navigate = useNavigate();
  return (
    <>
    <UserContext.Provider value = {{loggedUser,setLoggedUser}}>
    <BrowserRouter>
      <Routes>
      <Route path='/' element = {<Private Component = {Track}/>}/>
        <Route path='/register' element = {<Register/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/forgetPassword' element= {<ForgetPassword/>}/>
        <Route path='/LoginOtp' element={<LoginOtp/>}/>
        <Route path='/diet' element = {<Private Component = {Diet}/>}/>
        <Route path='/track' element = {<Private Component = {Track}/>}/>
        <Route path='*' element = {<NotFound/>}/>
      </Routes>
      </BrowserRouter>
    </UserContext.Provider>
    </>
  )
}

export default App
