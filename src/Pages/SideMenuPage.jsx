import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { filterProductsByPrice, setAllProducts } from '../Store/filterSlice';
import './Pages.css';



const SideMenuPage = () => {

const dispatch = useDispatch();
const param = useParams();
const pCategory = param.category;
const  filteredProducts = useSelector(state => state.filter.filteredProducts);
const data = useSelector(state => state.products.data);
const navigate = useNavigate();

/* dispatch(setAllProducts(category)) and retrieving filteredProducts
from filterSlice should only done once and in first component render
so used useEffect.otherwise it will create infinite rendering of component
dispatching and getting filteredProducts can take time and happen after page loads
so creating infinite loop*/
useEffect(() => {
  const category = data.filter(item => item.category === pCategory);
dispatch(setAllProducts(category));
}, []);

//(lowToHigh) is a boolean value
const handlePriceFilter = ((lowToHigh)=>{
  // When the handlePriceFilter function is called with false, it dispatches an action with the type filterProductsByPrice and payload (lowToHigh) which in this case will be false.
dispatch(filterProductsByPrice(lowToHigh))
});


return (
      <section>
        {filteredProducts.length > 0 ? (
          <>
          <h4 className='sidemenupage-category-h'>{pCategory}</h4> 
          <div className="sidemenupage-dropdown">
          <button className="sidemenupage-dropbtn">Sort by: Price<i className="sidemenupage-arrowdown"></i></button>
          <div className="sidemenupage-dropdown-content">
            <button onClick={() => handlePriceFilter(true)}>Price Low to High</button>
            <button onClick={() => handlePriceFilter(false)}>Price High to Low</button>
          </div>
        </div>
          <div className='sidemenupage-ul'>
            <ul>
              <div className='sidemenupage-card-organize'>
                {filteredProducts.map(item => (
                  <li key={item.id} className='sidemenupage-card-body'>
                      <div className="card ms-3" style={{width: "13rem"}}>
                        <img src={item.image} 
                        onClick={() => navigate(`/addcart/${item.id}`)}
                        className="sidemenupage-card-img-top" 
                        style={{ width: "57%" }}/>
                        <div className="sidemenupage-card-body">
                          <h6 className="sidemenupage-card-title">{item.title}</h6>
                          <h6 className='sidemenupage-price'>${item.price}</h6>
                        </div>
                      </div>
                  </li>
                ))}
              </div>
            </ul>
          </div>
          </>
        ) : (
          <p>Sorry, no item found for : {pCategory}</p>
        )}
        <Link to="/"><button className='sidemenupage-back-button'>&larr;back to home page</button></Link>
      </section>
);

}

export default SideMenuPage ;