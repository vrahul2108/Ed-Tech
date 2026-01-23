import React from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png";
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation, useSelector } from 'react-router-dom';

function Navbar() {
      const location = useLocation();
      const { token } = useSelector((state) => state.auth)
      const { user } = useSelector((state) => state.profile)
      const { totalItems } = useSelector((state) => state.cart)
      const matchRoute = (route)=> {
    
          return matchPath({path:route}, location.pathname);
  }
  return ( 
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
      <div className='flex items-center justify-between w-11/12 max-w-maxContent'>
        <Link to="/">
        <img src={logo} width={160} height={42} loading='lazy'/></Link>

        <nav>
          <ul className='flex gap-6 text-richblack-25'>
            { 
              NavbarLinks.map( (link, index) =>(
                   <li key={index}>
                    {
                      link.title === "Catalog" ? (<div></div>) : (
                        <Link to={link?.path}>
                          <p className ={ `${matchRoute(link?.path)? 'text-yellow-25' : 'text-richblack-25' }  `}>
                            {link.title}
                          </p>
                        </Link>
                      )
                    }
                  </li>)
              )
            }
          </ul>
        </nav>

        {/* login/ signup button */}
        <div className="items-center hidden gap-x-4 md:flex">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute grid w-5 h-5 overflow-hidden text-xs font-bold text-center text-yellow-100 rounded-full -bottom-2 -right-2 place-items-center bg-richblack-600">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        
    </div>
    </div>
  )
}

export default Navbar
