import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import statusCode from "../Utilities/statusCode";
import { setAllProducts, filterProductsByPrice } from "../Store/filterSlice";
import './Components.css';
import Loader from '../Utilities/Loader/Loader';

const Search = () => {
  const { data, status } = useSelector((state) => state.products);
  const productsToFilter = useSelector(
    (state) => state.filter.filteredProducts
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const searchKeyword = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    const matchedItems = data.filter((item) => item.title === searchKeyword);
    dispatch(setAllProducts(matchedItems));
  }, [searchKeyword, dispatch]);

  const handleFilterByPrice = ((lowToHigh) => {
    dispatch(filterProductsByPrice(lowToHigh));
  });

  return (
    <section>
      {status === statusCode.LOADING ? (
        <Loader />
      ) : status === statusCode.ERROR ? (
        <p className="error-state-error">
          Something went wrong !!! please try again later
        </p>
      ) : (
        <>
          {productsToFilter.length > 0 && <div className="search-dropdown">
            <button className="search-dropbtn">
              Sort by: Price<i className="search-arrowdown"></i>
            </button>
            <div className="search-dropdown-content">
              <button onClick={() => handleFilterByPrice(true)}>
                Price Low to High
              </button>
              <button onClick={() => handleFilterByPrice(false)}>
                Price High to Low
              </button>
            </div>
          </div>}

          {productsToFilter.length > 0 ? (
            <div className="search-ul">
              <ul>
                <div className="search-card-organize">
                  {productsToFilter.map((item) => (
                    <li key={item.id} className="search-card-body">
                        <div className="card ms-3" style={{ width: "13rem" }}>
                          <img
                            src={item.image}
                            className="search-card-img-top"
                            style={{ width: "57%" }}
                            onClick={() => navigate(`/addcart/${item.id}`)}
                          />
                          <div className="search-card-body">
                            <h6 className="search-card-title">
                              {item.title.slice(0, 50)}
                            </h6>
                            <h6 className="search-price">${item.price}</h6>
                          </div>
                        </div>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          ) : (<div className="search-sorry">
            <h3 >Sorry!</h3>
            <h3>No items found for: {searchKeyword}</h3></div>
          )}
          <Link to="/">
            <button className="search-back-button">
              &larr; Back to Home Page
            </button>
          </Link>
        </>
      )}
    </section>
  );
};

export default Search;
