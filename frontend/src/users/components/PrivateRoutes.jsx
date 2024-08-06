import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/auth-context'

const PrivateRoutes = () => {
    const auth = useContext(AuthContext)

   return auth.isLoggedIn ? <Outlet/> : <Navigate to='/auth' replace/>
}

export default PrivateRoutes