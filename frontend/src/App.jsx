import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState,useCallback } from "react";
import User from "./users/pages/User";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from './places/pages/UserPlaces'
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./context/auth-context";
import PrivateRoutes from './users/components/PrivateRoutes'

const App =()=> {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const login = useCallback(() =>{
    setIsLoggedIn(true)
  },[])

  const logout = useCallback(() =>{
    setIsLoggedIn(false)
  },[])

  return (
    <AuthContext.Provider value={{isLoggedIn: isLoggedIn, login:login, logout:logout}}>
      <Router>
        <MainNavigation/>
        <main>
        <Routes>
          <Route path='/' exact element={<User/>}/>
          <Route path='/:userId/places' element={<UserPlaces/>}/>
          <Route path='' element={<PrivateRoutes/>}> 
          <Route path='/places/new' element={<NewPlace/>}/>
          <Route path='/places/:placeId' element={<UpdatePlace/>}/>
          </Route>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
        </main>
      </Router>
      </AuthContext.Provider>
  )
}

export default App
