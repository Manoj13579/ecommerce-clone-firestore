import React, { useEffect, useState } from "react";
import { database } from "../../Utilities/Configure";
import {
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getProducts,
  deleteProduct,
} from "../../Store/productSlice";
import statusCode from "../../Utilities/statusCode";
import "./Admin.css";
import Loader from "../../Utilities/Loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../Utilities/Modal/ConfirmationModal";


const TotalProduct = () => {
 

  const [loading, setLoading] = useState(false);
  /* when to open modal. when isModalOpen false modal is hidden coz  if (!isOpen) return null;
  in ConfirmationModal.jsx */ 
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track which item to delete
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
// runs in component mount and gets product
  useEffect(() => {
    dispatch(getProducts());
  }, []);
  
  const products = useSelector((state) => state.products.data);
  const status = useSelector((state) => state.products.status);

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

  const handleDelete = async (id) => {
    setItemIdToDelete(id); // Set the item ID to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  //  if user proceeds with delete
  const handleConfirmDelete = async () => {
    if (itemIdToDelete) {
      try {
        setLoading(true);
        /* here we need to pass itemIdToDelete as id coz it has id which we want to delete. we have 
         given id through setItemIdToDelete(id) in handleDelete */
        const deleteVal = doc(database, "daraazdata", itemIdToDelete);
        await deleteDoc(deleteVal);
        dispatch(deleteProduct({ id: itemIdToDelete }));
        toast.success("deleted successfully");
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error(
          "An error occurred while deleting the product. Please try again."
        );
      }
      setLoading(false);
      setIsModalOpen(false); // Close the confirmation modal
      // good to set to null coz clears selected id works without it too though
      setItemIdToDelete(null);
    }
  };
// if user cancels Delete
  const handleCancelDelete = () => {
    setIsModalOpen(false); // Close the confirmation modal
    setItemIdToDelete(null);
  };
 const handleAddProductClick = () => {
  navigate("/adminproducthandle");
 }

  const handleEdit = (productid, producttitle, productdescription, productcategory, productimage, productprice, productquantity) => {
    navigate(`/adminproducthandle?id=${productid}&title=${producttitle}&description=${productdescription}&category=${productcategory}&image=${productimage}&price=${productprice}&quantity=${productquantity}`)
  };


  return (
    <>
    {loading && < Loader/>}
    <section className="totalproduct-container">
      <div className="header">
      <h5>All Product</h5>
      <button onClick={handleAddProductClick}>Add Product</button>
      </div>
      <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Product</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
              <th>Added On</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
  {products
  // Make a shallow copy of the products array coz .sort method overwrites original array
    .slice()
    // registrationDate is in string format so changed to Date object to compare.
    //substracting date automatically changes to milliseconds and substracts it.
    .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
    .map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td className="totalproduct-img">
          <img src={item.image} alt="" />
        </td>
        <td>{item.title}</td>
        <td>{item.category}</td>
        <td>${item.price}</td>
        <td>{item.quantity}</td>
        <td>
          <button
            onClick={() => handleDelete(item.id)}
            className="totalproduct-button-delete"
          >
            Delete
          </button>
          <button
            onClick={() =>
              handleEdit(
                item.id,
                item.title,
                item.description,
                item.category,
                item.image,
                item.price,
                item.quantity
              )
            }
            className="totalproduct-button-edit"
          >
            Edit
          </button>
        </td>
        <td>{item.registrationDate}</td>
        <td>{item.updateDate ? item.updateDate : "Not Updated"}</td>
      </tr>
    ))}
</tbody>
      </table>
    </section>
     {/* Confirmation Modal */}
     <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

export default TotalProduct;