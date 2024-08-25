import React, { useEffect } from 'react';
import {  
  useNavigate,
  useParams, 
  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '../Store/cartSlice';
import './Pages.css';
import { getReview } from '../Store/reviewSlice';
import statusCode from '../Utilities/statusCode';
import Loader from '../Utilities/Loader/Loader';
import StarRating from '../Utilities/StarRating/StarRating';

const AddCart = () => {
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReview());
  },[]);

  const navigate = useNavigate();
  const allproducts = useSelector(state => state.products.data);
  const review = useSelector(state => state.reviews.data);
  const status = useSelector(state => state.reviews.status);
  const param = useParams();
  const productid = param.id;
  //find method returns the first element in the array that satisfies the provided testing function. 
  /* filter method returns all element in the array that satisfies the provided testing function
       so it is an array*/
  const product = allproducts.find(item => item.id === productid);
  const particularReview = review.filter(item => item.productId === productid);
const handleAddToCart = (product) => {
  dispatch(add(product));
  navigate('/cart');
};

const handleClick = ()=>{
  navigate(-1);
}
if (status === statusCode.LOADING) {
  return <Loader />;
}

if (status === statusCode.ERROR) {
  return (
    <p className="error-state-error">
        Something went wrong !!! please try again later
      </p>
    );
  }
  
  const averageRating = particularReview.length > 0
  ? particularReview.reduce((total, item) => total + item.rating, 0) / particularReview.length
  : 0;

  return (
    <section className="addcart-container">
      <div className="addcart-item">
        <div className='addcard-body'>
          <div className="card ms-3" style={{width: "13rem"}}>
            <img src={product.image} className="addcard-img-top"/>
            <div className="addcard-body">
              <h6 className="addcard-title">{product.title}</h6>
              <h6 className='addcard-price'>${product.price}</h6>
            </div>
          </div>
        </div>
        <div className='addcard-body'>
          <p className='addcard-top'>{product.description}</p>
        </div>
        <div className='addcard-body'>
          <p className='add-delivery'>Delivery</p>
          <p className='addcard-delivery'>Standard Delivery- 2 to 3 days</p>
          <p className='addcard-delivery'>warranty not available</p>
        </div>
      </div>
      <button className='addtocart-btn' onClick={() => handleAddToCart(product)}>Add to Cart</button>
      <div>
      <button className='back' onClick={handleClick}>&larr; Back to Shopping</button>
      </div>
      <div className='addcart-reviews'>
      <h5>Reviews and Rating({particularReview.length})</h5>
      <div className='addcart-averagetext'>Average Rating: <StarRating rating = {averageRating}/></div>
      <ul>
        {
          particularReview.map(item => (
            <li key={item.id}>
              {/*new Date(item.timestamp).toLocaleDateString() used to get just date from timestamp  */}
              <p>by {item.name} on: <span className='addcart-datespan'>{new Date(item.timestamp).toLocaleDateString()}</span></p>
              <div className='addcart-ratediv'>rating: < StarRating rating = {item.rating}/></div>
              <p className='addcart-ratediv'>{item.review}</p>
            </li>
          ))
        }
      </ul>
      </div>
    </section>
  );
}
export default AddCart;
