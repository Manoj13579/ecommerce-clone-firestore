// after react 18 it is not necessary to import react.choice is yours
import React, { useEffect, useState, } from 'react';
import { useNavigate, Outlet, Link, NavLink } from 'react-router-dom';
import Footer from './Footer.jsx';
import { useSelector } from 'react-redux';
import './Components.css';
import { toast } from 'react-toastify';
import { auth } from '../Utilities/Configure.js';
import { signOut } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { SET_REMOVE_USER_INFO } from '../Store/loginSlice.js';
import { getProducts } from '../Store/productSlice.js';


const Layout = () => {
  useEffect(() => {
    dispatch(getProducts())
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart);
    const userinfo = useSelector(state => state.userinfo);
    const allproducts = useSelector(state => state.products.data);
    

    const searchedProducts = allproducts.filter((obj) => 
      obj.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    ).slice(0, 8);
    


    
    const isAnyPropertyNull = 
    userinfo.email === null ||
    userinfo.name === null ||
    userinfo.role === null ||
    userinfo.uid === null  ||
    userinfo.registrationDate === null;
    
  
    
  const activeLink = ({isActive}) => {
  return isActive ? 'activeLink' : '';
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchTerm === ""){
        alert("cannot have blank search")
      }
      else{
        navigate('search', { state:searchTerm });
        setSearchTerm("");
    }}
  };

 const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm === ""){
      toast.alert("cannot have blank search")
    }
    else{
    navigate('search', { state:searchTerm });
    setSearchTerm("");
  }};


  const handleLogout = () => {
    signOut(auth).then(() => {
      toast.success("logged out successfully");
      navigate('/');
      dispatch(SET_REMOVE_USER_INFO());
    }).catch((error) => {
      toast.error(error.message);
    });
  };

  const totalQuantity = products.reduce((total, currentItem) => {
    return total + currentItem.cartquantity;
  }, 0);
  
  return (
  <>
  <div className="top-navbar">
          <NavLink to='seller' className={activeLink}>Become Seller</NavLink>
          <a href="#">Help & Support</a>
          <a href="#">E Clone Logistics Partner</a>
  </div>
<nav className="secondnavbar-container">
<Link to='/'><h3>E Clone</h3></Link>
  <div className='inputsecondnavbar-wrapper'>
    <input className='input-secondnavbar'
        type="search" 
        placeholder="Search in E Clone" 
        aria-label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}/>
        {/* search dropdown */}
        {searchTerm && searchedProducts.length > 0 ? (
  <div className="navbarsearch-dropdown">
    {
      searchedProducts.map((item) => (
        <div
                  className="navbarsearch-item"
                  onClick={() => {
                    navigate('search', { state: item.title });
                    setSearchTerm("");
                  }}
          key={item.id}
        >
          {item.title}
        </div>
      ))
    }
  </div>
) : ("")}

      <button onSubmit={handleSubmit} className='navbarsearch-button'><i className="bi bi-search"></i></button>
      </div>
     <div className="right-items-navbar">
      {/* display on logout */}
      {/* just wrapped each item under individual {isAnyPropertyNull && just for space around of  right-items-navbar
      can use under one div and one {isAnyPropertyNull &&*/}
     {isAnyPropertyNull && <i className="bi bi-person text-white h4 mt-2"></i>}
      
     {isAnyPropertyNull && <span className='layout-navlink'><NavLink to='login' className={activeLink}>login</NavLink></span>}
     {isAnyPropertyNull && <h4 className='navbarbtn-divider'>|</h4>}
      {isAnyPropertyNull &&<span className='layout-navlink'><NavLink to='register' className={activeLink}>signup</NavLink></span>}

      {/* display on login */}
      {!isAnyPropertyNull && 
      // can use custom css in bootstrap if needed.
      <div className="layout-dropdown">
        <p className='layout-dropdown-p'>{userinfo.name.charAt(0).toUpperCase()}</p>
      <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      Hello, {userinfo.name}
      </button>
      <ul className="dropdown-menu">
        <li><Link className={`dropdown-item ${activeLink}`}to='myorder'>My Order</Link></li>
        <li><p onClick={handleLogout}className="dropdown-item">logout</p></li>
      </ul>
    </div>
      // <div>
      //   <span className='layout-navlink-username'><FaUserCircle size={16} />Hello, {userinfo.name}</span>
      //   <span className='layout-navlink'><NavLink to='myorder' >My Order</NavLink></span>className={activeLink}
      //   <span className='layout-navlink-logout' onClick={handleLogout}>logout</span>
      //   </div>
      }
        
<i className="bi bi-globe text-white"></i>
      <ul className="navbar-nav ms-2">
        <li className="nav-item dropdown">
          <a className="nav-link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            EN
          </a>
          <ul className="dropdown-menu">
            <li className='text-muted ms-3'><h6><small>select language</small></h6></li>
            <li><a className="dropdown-item text-muted" href="#"><h6><small>English</small></h6></a></li>
            <li><a className="dropdown-item text-muted" href="#"><h6><small>Nepali</small></h6></a></li>
          </ul>
        </li>
      </ul>
     <Link to="cart" className='navbar-cart-link'><i className="bi bi-cart text-white h3 ms-4">
      
      {!isAnyPropertyNull &&<span className='navbar-cartproducts-quantity'>{totalQuantity}</span>}
      
      </i></Link>
      </div>
</nav>

<Outlet />
<Footer />
</>
  )
}

export default Layout;