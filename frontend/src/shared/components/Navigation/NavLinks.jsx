import { NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../../context/auth-context"
import './NavLinks.css'
import Button from "../FormELements/Button/Button"
const NavLinks = props => {
  const auth = useContext(AuthContext)
  return ( <ul className="nav-links">
    <li>
    <NavLink to='/' exact="true" >All Users</NavLink>
    </li>
    {
      auth.isLoggedIn && (
        <>
        <li>
        <NavLink to='/u1/places'>My Places</NavLink>
        </li>
        <li>
        <NavLink to='/places/new'>Add Place</NavLink>
        </li>
        <li>
        <button onClick={auth.logout}>Logout</button>
        </li>
        </>
      )
    }
   
    {
      !auth.isLoggedIn && (
       
    <li>
    <NavLink to='/auth'>Authenticate</NavLink>
    </li>
      )
    }
   
  </ul>
   
  )
}

export default NavLinks