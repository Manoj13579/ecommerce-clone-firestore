import React, { useState } from 'react';
import image1 from '../assets/angela.jpg';
import image2 from '../assets/sally molly.jpg';
import image3 from '../assets/sarah.jpg';
import './Pages.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaComputer } from "react-icons/fa6";
import { GiNecklaceDisplay, GiClothes } from "react-icons/gi";
import { PiHandbagSimpleFill } from "react-icons/pi";


const Carousel = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
    const products = useSelector(state => state.products.data);
    const uniqueCategories = [...new Set(products.map(item => item.category))];
     const navigate = useNavigate();

    const handleSubMenuToggle = (categoryId) => {
      /*setOpenSubMenu() checks if openSubMenu value which is
        null === categoryId which willnever be true when clicked.if false it returns
        categoryId.now when  handleSubMenuToggle() is clicked openSubMenu
        will have categoryId 
        */
        setOpenSubMenu(openSubMenu === categoryId ? null : categoryId);
    };

    const handleMouseLeave = () => {
        setOpenSubMenu(null)
    };
 const categoryIcons = {

    electronics: <FaComputer className="sidemenu-category-icon" />,
    // can use "" for key name inside object
    "men's clothing": <GiClothes className="sidemenu-category-icon" />,
    jewellery: <GiNecklaceDisplay className="sidemenu-category-icon" />,
    "women's clothing": <GiClothes className="sidemenu-category-icon" />,
    bags: <PiHandbagSimpleFill className="sidemenu-category-icon" />,
}
  
  return (
    <section className= "sidemenu-carousel-container">
    <div className='side-menu-container' onMouseLeave={handleMouseLeave}>
        <ul className='category-ul'>
            {uniqueCategories.map(category => (
                <li className="category-li" key={category}>
                    <a href="#" onMouseOver={() => handleSubMenuToggle(category)}>
                      {/* when iterating on mapping through uniqueCategories, and the current value of category is "electronics". When we encounter "electronics", categoryIcons[category] essentially retrieves the value associated with the key "electronics" from the categoryIcons object defined above or becomes categoryIcons[electronics] and so on and mapping cycle runs till end*/}
                     {categoryIcons[category]}
                        {category}
                    </a>
                    {openSubMenu === category && (
                        <ul className='subcategory-ul'>
                                <li className='subcategory-li' onClick={() => navigate(`sidemenupage/${category}`)}>
                                    {category}
                            </li>
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    </div>
    <div className='carousel-container'>
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item active" data-bs-interval="2000">
      <img src={image1} className="d-block w-100" alt="..."/>
      <div className="carousel-caption">
        <h2 className='text-color'>Best Price Guaranteed</h2>
      </div>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src={image2} className="d-block w-100" alt="..."/>
      <div className="carousel-caption">
        <h2 className='text-color'>Every Day Low Price</h2>
      </div>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src={image3} className="d-block w-100" alt="..."/>
      <div className="carousel-caption">
        <h2 className='text-color'>Free Delivery</h2>
      </div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
</div>
</section>
  )
}

export default Carousel;