import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Admin.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SET_REMOVE_USER_INFO } from '../../Store/loginSlice.js';
import { auth } from '../../Utilities/Configure.js';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';
import { GrBasket } from "react-icons/gr";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbUsers } from "react-icons/tb";
import { getOrders } from '../../Store/userOrder';
import statusCode from "../../Utilities/statusCode";
import Loader from '../../Utilities/Loader/Loader';
import { getUsers } from '../../Store/getusersSlice.js';



const AdminLayout = () => {
   
   const dispatch = useDispatch();
   useEffect(() => {
    dispatch(getOrders());
    dispatch(getUsers());
   }, [])
 


   const userinfo = useSelector(state => state.userinfo);
   const totalProduct = useSelector(state => state.products.data);
   const navigate = useNavigate();
   const status = useSelector((state) => state.uorders.status);
   const myOrders = useSelector(state => state.uorders.data);
   const users = useSelector(state => state.users.data);
   const usersstatus = useSelector((state) => state.users.status);
   


 
  if (status === statusCode.LOADING) {
    return <Loader />
  }

  if (status === statusCode.ERROR) {
    return (
      <p className="error-state-error">
        Something went wrong !!! please try again later
      </p>
    );
  }

  if (usersstatus === statusCode.LOADING) {
    return <Loader />
  }

  if (usersstatus === statusCode.ERROR) {
    return (
      <p className="error-state-error">
        Something went wrong !!! please try again later
      </p>
    );
  }
  const totalOrder = myOrders.flatMap((products) => {
    return products.cartProducts.map((item) => item.length);
  });

  

    const activeLink = ({ isActive }) => (
        isActive ? 'adminLink' : ''
    );

        const handleLogout = () => {
          signOut(auth).then(() => {
            toast.success("logged out successfully");
            navigate('/');
            dispatch(SET_REMOVE_USER_INFO());
          }).catch((error) => {
            toast.error(error.message);
          });
        };
        
  return (
    <div className='admin-layout-container'>
      <h6 onClick={handleLogout} className='logout'>logout</h6>
      <div className='admin-info-container'>
      <div className='admin-info'>
      <span><FaUserCircle size={70} /></span>
      <h6>Hi {userinfo.role}, welcome!</h6>
      <h6>email: {userinfo.email}</h6>
      <h6>Registered On: {userinfo.registrationDate}</h6>
      </div>
      </div>
    <nav className='admin-navbar'>
    <NavLink to='.' end className={activeLink}><span><GrBasket size={40}/></span>
        <h5>{totalProduct.length}</h5>
        <p>Total Product</p>
        </NavLink>
      <NavLink to='totalorder' className={activeLink}
      ><span><CiDeliveryTruck size={40}/>
      </span>
        <h5>{totalOrder.length}</h5>
        <p>Total Order</p>
        </NavLink>
      <NavLink to='totalusers' className={activeLink}>
        <span><TbUsers size={40}/></span>
      <h5>{users.length}</h5>
      <p>Total User</p>
      </NavLink>
    </nav>
      <Outlet/>
    </div>
  )
}

export default AdminLayout;