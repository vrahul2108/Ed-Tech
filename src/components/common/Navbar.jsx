import React from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png";
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom';

function Navbar() {
        const location = useLocation();
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
        
    </div>
    </div>
  )
}

export default Navbar
