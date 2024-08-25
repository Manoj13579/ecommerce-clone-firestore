import React, { useEffect, useRef, useState } from "react";
import { database } from "../../Utilities/Configure";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getProducts,
  updateProduct,
} from "../../Store/productSlice";
import "./Admin.css";
import { useNavigate, useLocation } from "react-router-dom";
import statusCode from "../../Utilities/statusCode";
import Loader from "../../Utilities/Loader/Loader";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AdminProductHandle = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [editId, setEditId] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);

  const inputRef = useRef();

  const value = collection(database, "daraazdata");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 500);
    dispatch(getProducts());
    const itemId = query.get("id");
    const itemTitle = query.get("title");
    const itemDescription = query.get("description");
    const itemCategory = query.get("category");
    const itemImage = query.get("image");
    const itemPrice = query.get("price");
    const itemQuantity = query.get("quantity");
    // Retrieves and sets edit item details if query parameters are present
    if (itemId) {
      setEditId(itemId);
      setTitle(itemTitle);
      setDescription(itemDescription);
      setCategory(itemCategory);
      setImage(itemImage);
      setPrice(itemPrice);
      setQuantity(itemQuantity);
      setShowUpdate(true);
    }
  }, []);
  const products = useSelector((state) => state.products.data);
  const status = useSelector((state) => state.products.status);
   // Filters product by editId to get specific product details for update
  const getProductsById = products.filter((item) => item.id === editId);
  
/* using this only coz when  dispatch(getProducts()); getProducts runs or products is fetched
 from firestore. for others like  addDoc,updateDoc or delete or any other it doesnot work */
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

  const handleSubmit = async () => {
    if (!title || !description || !category || !image || !price || !quantity) {
      toast.info("Please fill all fields.");
      return;
    }
    try {
      // get value from input field and add to doc
      const docRef = await addDoc(value, {
        title,
        description,
        category,
        image,
        price,
        quantity,
        updateDate: null,
        registrationDate: new Date().toLocaleString(
          'en-US',
          {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          }),
      });
// if you don't dispatch entire object stored in single variable you need to pass id like this
      const id = docRef.id;
      dispatch(
        addProduct({
          id,
          title,
          description,
          category,
          image,
          price,
          quantity,
          updateDate: null,
          registrationDate: new Date().toLocaleString(
            'en-US',
            {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            }),
          })
      );
      resetFields();
      toast.success("Product added successfully.");
      navigate(-1);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!title || !description || !category || !image || !price || !quantity) {
      toast.info("Please fill all fields.");
      return;
    }
    try {
      // getting editId from useQuery coz we are editing id from previous page
      const editDoc = doc(database, "daraazdata", editId);
      await updateDoc(editDoc, {
        /* In JavaScript, when an object is defined with key-value pairs where the key and the variable name are the same, you can use the shorthand property name.
        here we are giving title key that is to be updated in firestore value of title user enters hold by title 
        variable in useState . it is equivalent to title: title*/
        title,
        description,
        category,
        image,
        price,
        quantity,
        updateDate: new Date().toLocaleString(
          'en-US',
          {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          }),
      });
      dispatch(
        updateProduct({
          // need to provide new editId coz in each update firestore creates new id
          id: editId,
          title,
          description,
          category,
          image,
          price,
          quantity,
          updateDate: new Date().toLocaleString(
            'en-US',
            {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            }),
        })
      );
      resetFields();
      toast.success("Updated successfully.");
      navigate(-1);
    } catch (error) {
      toast.error(error);
    }
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setImage("");
    setPrice("");
    setQuantity("");
    setShowUpdate(false);
  };

  const handleCancel = () => {
    resetFields("");
  };
const handleQuantity = (value) => {
  if(value < 0){
    setQuantity(0);
  }
  else{
    setQuantity(value);
  }
}
const handlePrice = (value) => {
  if(value < 0){
    setPrice(0);
  }
  else{
    setPrice(value);
  }
}
  return (
    <>
    <div className="adminproduct-handle-totalcontainer">
    {/* in {editId && <img src={getProductsById[0].image} />} However, the key point here is that filter() always returns an array, even if it contains only one element.
      So getProductsById is technically an array, even if it contains only one product object. That's why when you log getProductsById, you see an array with a single object.
      To access the product object directly, you would use getProductsById[0], because getProductsById is an array with one element (the filtered product object) */}
      { editId && <section className="adminproduct-handle-card-organize">
      <div className="category-card-body">
            <div className="card ms-3" style={{ width: "13rem" }}>
              <img
                src={getProductsById[0].image}
                className="adminproduct-handle-card-img-top"
                style={{ width: "57%" }}
              />
              <div className="adminproduct-handle-card-body">
                <h6 className="category-card-title">
                  {getProductsById[0].description.split(" ").slice(0, 9).join(" ")}
                </h6>
                <h6 className="adminproduct-handle-price">${getProductsById[0].price}</h6>
              </div>
            </div>
        </div>
    </section>}
      <section className="adminproduct-handle-container">
        <div className="adminproduct-handle-input-container">
        <p>Title</p>
        <input
          required
          ref={inputRef}
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>Choose Category</p>
    <select
    required
    placeholder="Enter category"
    type='select'
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    >
      <option value="choose">Choose Category</option>
      <option value="women's clothing">women's clothing</option>
      <option value="men's clothing">men's clothing</option>
      <option value="jewellery">jewellery</option>
      <option value="electronics">electronics</option>
      <option value="bags">bags</option>
    </select>
        <p>Enter Image URL</p>
        <input
          required
          type="text"
          placeholder="Enter Image-Url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <p>Enter Price</p>
        <input
          required
          type="number"
          placeholder="Enter Price"
          value={price}
          onChange={(e) => handlePrice(Number(e.target.value))}
        />
        <p>Enter Quantity</p>
        <input
          required
          type="number"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) => handleQuantity(Number(e.target.value))}
        />
        <p>Enter Description</p>
        <textarea
          required
          type="text"
          rows= '4'
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </div>
        {!showUpdate ? (
          <button
            onClick={handleSubmit}
            className="adminproduct-handle-submit-update-btn"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="adminproduct-handle-submit-update-btn"
          >
            Update
          </button>
        )}
        <button
          onClick={handleCancel}
          className="adminproduct-handle-submit-update-btn"
        >
          Cancel
        </button>
        
      </section>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="adminproduct-handle-backpage"
      >
        &larr; Back to admin page
      </button>
      </>
  
  );
};

export default AdminProductHandle;