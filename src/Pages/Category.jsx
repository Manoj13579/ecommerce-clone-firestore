import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../Store/productSlice";
import statusCode from "../Utilities/statusCode";
import './Pages.css';
import Loader from "../Utilities/Loader/Loader";
import { useNavigate } from "react-router-dom";


const Category = () => {
  const dispatch = useDispatch();

  // runs in component mount and gets product
  useEffect(() => {
    dispatch(getProducts());
  }, []);
  const products = useSelector((state) => state.products.data);
  const status = useSelector((state) => state.products.status);
  const navigate = useNavigate();
  

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

  return (
    <section className="category-card-organize">
      {products.map((products) => (
        <div key={products.id} className="category-card-body">
            <div className="card ms-3" style={{ width: "13rem" }}>
              <img
                src={products.image}
                className="category-card-img-top"
                style={{ width: "57%" }}
                onClick={() => navigate(`addcart/${products.id}`)}
              />
              <div className="category-card-body">
                <h6 className="category-card-title">
                  {products.description.split(" ").slice(0, 9).join(" ")}
                </h6>
                <h6 className="category-price">${products.price}</h6>
              </div>
            </div>
        </div>
      ))}
    </section>
  );
};

export default Category;
