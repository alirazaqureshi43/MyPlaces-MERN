import './MainNavigation.css'
import MainHeader from './MainHeader'
import { Link } from 'react-router-dom'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from '../UIElements/Backdrop'
import { useState } from 'react'
const MainNavigation=props=> {
    const [drawerIsOpen, SetDrawerIsOpen] = useState(false)
    const closeDrawer = () =>{
        SetDrawerIsOpen(false)
    }
    const openDrawer = () =>{
        SetDrawerIsOpen(true)
    }
  return (
    <>
    {drawerIsOpen && <Backdrop onClick={closeDrawer}/>}
      <SideDrawer show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
            <NavLinks/>
        </nav>
    </SideDrawer>
    <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
            <span/>
            <span/>
            <span/>
        </button>
        <h1 className="main-navigation__title">
            <Link to='/'>
            YourPlaces
            </Link>  
        </h1>
        <nav className='main-navigation__header-nav'>
           <NavLinks/>
        </nav>
    </MainHeader>
    </>
  )
}

export default MainNavigation