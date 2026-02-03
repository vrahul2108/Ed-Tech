import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png";
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux"
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoIosArrowDropdownCircle } from 'react-icons/io';



const subLinks = [
  {
    title: "Python",
    link: "/catalog/python",
  },
  {
    title: "javascript",
    link: "/catalog/javascript",
  },
  {
    title: "javascript",
    link: "/catalog/javascript",
  },
  {
    title: "javascript",
    link: "/catalog/AI",
  },
  {
    title: "javascript",
    link: "/catalog/Machine Learning",
  },
  
];

function Navbar() {
      const location = useLocation();
      const { token } = useSelector((state) => state.auth)
      const { user } = useSelector((state) => state.profile)
      const { totalItems } = useSelector((state) => state.cart)
      
      const [ssubLinks, setSsubLinks] = useState([]);
      const fetchSublinks = async()=>{
          try{
            const result =await apiConnector("GET", categories.CATEGORIES_URL);
            console.log("Printing sublinks result: " , result);
            setSsubLinks(result.data.data);
          }
          catch(e){
            console.log('Could not fetch the category list');
          }
        }

      useEffect(()=>{
        fetchSublinks();
      },[])

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
                      link.title === "Catalog" ? (
                      <div className='relative flex items-center gap-2 group'>
                        <p>{link.title}</p>
                        <IoIosArrowDropdownCircle/>

                        <div className='invisible absolute left-[50%] top-[50%] flex flex-col
                         -translate-x-[50%] translate-y-[40%]
                         rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 duration-200
                         transition-all group-hover:visible group-hover:opacity-100 lg:w-[300px]'>

                          <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded 
                          translate-x-[80%] -translate-y-[40%] bg-richblack-5'>
                          </div>

                        {
                          subLinks.length ? (
                            
                              subLinks.map( (sublink, index)=>(
                                <Link to={`${sublink.link}`} key= {index} 
                                className="block px-4 py-2 text-sm transition-all duration-200 rounded-md text-richblack-900 hover:bg-richblack-100 hover:text-richblack-800">
                                  <p>{sublink.title}</p>
                                </Link>
                              ))  
                          ) : (<div></div>)
                        }
                        </div>

                      </div>) : (
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
          {token !== null && <ProfileDropDown />}
        </div>
        
    </div>
    </div>
  )
}

export default Navbar
