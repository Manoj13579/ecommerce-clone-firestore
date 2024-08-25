import React from 'react';
import image1 from '../assets/delivery.png';
import image2 from '../assets/electronics.png';
import './Pages.css';



const ImageCategory = () => {
  return (
    <section>
        <div className='imagecategory-container'>
        <a href = "#">
          <img src={image1}/><span>Free Delivery</span>
          </a>
          <a href = "#">
          <img src={image2}/><span>Low Price</span>
          </a>
          <a href = "#">
          <img src={image2}/><span>Electronics</span>
          </a>
        </div>
    </section>
  )
}

export default ImageCategory;