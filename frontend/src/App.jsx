import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense} from "react";
// import User from "./users/pages/User";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from './places/pages/UserPlaces'
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./users/pages/Auth";
// import PrivateRoutes from './users/components/PrivateRoutes'
import { AuthContext } from "./context/auth-context";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { useAuth } from "./hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const User = React.lazy(()=>import("./users/pages/User"))
const NewPlace = React.lazy(()=>import("./places/pages/NewPlace"))
const UserPlaces = React.lazy(()=>import('./places/pages/UserPlaces'))
const UpdatePlace = React.lazy(()=>import("./places/pages/UpdatePlace"))
const Auth = React.lazy(()=>import("./users/pages/Auth"))
const PrivateRoutes = React.lazy(()=>import('./users/components/PrivateRoutes'))

const App =()=> {
  const {login, logout, token, userId}  = useAuth()
  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId, login:login, logout:logout}}>
      <Router>
        <MainNavigation/>
        <main>
        <Suspense fallback={
          <div className="center">
            <LoadingSpinner/>
          </div>
        }>
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
        </Suspense>
        </main>
      </Router>
      </AuthContext.Provider>
  )
}

export default App
