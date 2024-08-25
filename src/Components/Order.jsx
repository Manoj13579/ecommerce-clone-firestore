import React, { useState, useEffect, useRef } from "react";
import './Components.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { database } from "../Utilities/Configure";
import Loader from "../Utilities/Loader/Loader.jsx";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { resetCart } from '../Store/cartSlice';
import { addOrder } from "../Store/userOrder.js";


const Order = () => {
  
  const [order, setOrder] = useState({
    email: "",
    mobile: "",
    district: "",
    address: "",
    status: "processing",
  });

  const [loading, setLoading] = useState(false);
  const userinfo = useSelector((state) => state.userinfo);
  const navigate = useNavigate();
  const cartProducts = JSON.parse(localStorage.getItem("cart"));
  const dispatch = useDispatch();
  // / Create user reference on firestore
  const userReference = collection(database, "userorder");
  const inputRef = useRef();
  
  useEffect(() => {
    if(loading){
    localStorage.removeItem("cart");
      dispatch(resetCart());}
    }, [loading]);
    
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userorder = {
      name: userinfo.name,
      email: order.email,
      mobile: order.mobile,
      district: order.district,
      address: order.address,
      status: order.status,
      userId: userinfo.uid,
      OrderDate: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      // cart product object stored
      cartProducts: cartProducts.map((product) => ({
        id: product.id,
        title: product.title,
        quantity: product.quantity,
        image: product.image,
        description: product.description,
        category: product.category,
        price: product.price,
        orderedQuantity: product.cartquantity,
      })),
    };

    try {
      setLoading(true);
      
      // Add user detail
    await addDoc(userReference, userorder); // Await the addDoc function
   dispatch(addOrder({userorder}));
      // Reset form fields
      setOrder({
        email: "",
        mobile: "",
        district: "",
        address: "",
      });

      // Navigate to the 'myorder' page
      navigate("/myorder");

      // Show success toast
      toast.success("Order successfully placed");
    } catch (error) {
      // Show error toast if there's an error
      toast.error(error.message);
    }
    setLoading(false);
  };
/* price * quantity won't work coz we have to calculate more 
then one items inside a cart. */
  const totalPrice = cartProducts.reduce((total, currentItem) => {
    return total + currentItem.price * currentItem.cartquantity;
  }, 0);
  
  const totalQuantity = cartProducts.reduce((total, currentItem) => {
    return total + currentItem.cartquantity;
  }, 0);

  return (
    <>
    <section className="order-container">
      {loading && <Loader />}
        <div className="orderform-container">
          <h3 className="orderform-text">Shipping Info:</h3>
          <form onSubmit={handleSubmit} className="order-form">
            <input
              required
              ref={inputRef}
              autoFocus
              placeholder="Enter contact email"
              type="email"
              value={order.email}
              onChange={(e) =>
                setOrder({
                  ...order,
                  email: e.target.value,
                })
              }
            />
            <input
              required
              placeholder="Enter mobile"
              type="text"
              value={order.mobile}
              onChange={(e) =>
                setOrder({
                  ...order,
                  mobile: e.target.value,
                })
              }
            />
            <input
              required
              placeholder="Enter district"
              type="text"
              value={order.district}
              onChange={(e) =>
                setOrder({
                  ...order,
                  district: e.target.value,
                })
              }
            />
            <input
              required
              placeholder="Enter Address"
              type="text"
              value={order.address}
              onChange={(e) =>
                setOrder({
                  ...order,
                  address: e.target.value,
                })
              }
            />

            <button type="submit">Place Order</button>
          </form>
        </div>
      <div className='order-proceed-container'>
    <h6>Order Summary</h6>
    <p className='order-proceed-total'>Subtotal ({totalQuantity}items): <span>${totalPrice}</span></p>
    <p className='order-proceed-total'>Shipping fee <span>free</span></p>
    <p className='order-proceed-total'>Total-
      <span>${totalPrice}</span></p>
    </div>
    </section>
        <h6 className="ordercart-product-h">Your Order:</h6>
        {cartProducts.map((product) => (
          <div className="ordercart-container" key={product.id}>
              <img
                className="ordercart-item-img"
                src={product.image}
                alt={product.title}
              />
              <h6 className="ordercart-price">price: <span>${product.price}</span></h6>
              <h6 className="ordercart-price">quantity: <span>{product.cartquantity}</span></h6>
          </div>
        ))}
        <button onClick={() => navigate("/cart")} className="ordercart-back">&larr; go back to cart</button>
    </>
  );
};

export default Order;