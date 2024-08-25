import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDoc, doc ,addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { LuPackage } from "react-icons/lu";
import Loader from '../Utilities/Loader/Loader';
import { deleteOrder, getOrders } from '../Store/userOrder';
import statusCode from "../Utilities/statusCode";
import ConfirmationModal from "../Utilities/Modal/ConfirmationModal";
import ReviewModal from '../Utilities/Modal/ReviewModal';
import { database } from '../Utilities/Configure';
import './Components.css';
import { addReview } from '../Store/reviewSlice';
const MyOrder = () => {
  const userOrders = useSelector(state => state.uorders.data);
  const dispatch = useDispatch();
  const status = useSelector(state => state.uorders.status);
  const uid = useSelector(state => state.userinfo.uid);
  const particularUser = userOrders.filter(id => id.userId === uid);
  const [openModal, setOpenModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);
  const reviewReference = collection(database, "review");
  const userinfo = useSelector((state) => state.userinfo);


  
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleDelete = (id) => {
    setOpenModal(true);
    setCancelOrderId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const deleteVal = doc(database, "userorder", cancelOrderId);
      await deleteDoc(deleteVal);
      dispatch(deleteOrder({ id: cancelOrderId }));
      toast.success("canceled successfully");
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("An error occurred while deleting the product. Please try again.");
    }
    setLoading(false);
    setOpenModal(false);
    setCancelOrderId(null);
  };

  const handleCancelDelete = () => {
    setOpenModal(false);
    setCancelOrderId(null);
  };

  const handleWriteReview = (productId) => {
    setReviewProductId(productId);
    setReviewModalOpen(true);
  };
/* here data refers to { review, rating } in form submit */
  const handleReviewSubmit =async (data) => {
  let allData = {
    ...data, 
    productId:reviewProductId, 
    name:userinfo.name,
    timestamp: serverTimestamp(),
  }
  try {
    setLoading(true);
    
  await addDoc(reviewReference, allData);
 dispatch(addReview({allData}));
    toast.success("review placed");
  } catch (error) {
    toast.error(error.message);
  }
  setLoading(false);
};

  const handleReviewCancel = () => {
    setReviewModalOpen(false);
    setReviewProductId(null);
  };

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
    <>
      {loading && <Loader />}
      {particularUser.length > 0 ? (
        <section>
          {particularUser.map((product) => (
            <div key={product.id} className='myorder-container'>
              {/* here no need to use && but below By adding product.cartProducts &&, you're ensuring that cartProducts is not undefined or null before trying to map over it. takes time to get value in child array and throws error if used below */}
    {/* product.cartProducts takes time to load so need &&.
        userOrders.map will be handled by status but not child array*/}
              {product.cartProducts && product.cartProducts.map((item) => (
                <div key={item.id}>
                  <h5 className="myordercart-product-h">My Order:</h5>
                  <p><LuPackage /> Package 1</p>
                  <p>order: {product.id}</p>
                  <p className='myorder-placedon'>placed on {product.OrderDate}</p>
                  {product.status === "processing" ? (
                    <div>
                      <span>{product.status}</span>
                      <progress value="50" max="100"></progress>
                    </div>
                  ) : (
                    <div>
                      <progress value="100" max="100"></progress>
                      <span>{product.status}</span>
                    </div>
                  )}

                  <div className="myordercart-container">
                    <img
                      className="myordercart-item-img"
                      src={item.image}
                      alt="image"
                    />
                    <h6>price: <span className="myordercart-price">${item.price}</span></h6>
                    <h6>quantity: <span className="myordercart-price">{item.orderedQuantity}</span></h6>
                  </div>
                  {product.status === "processing" ? (
                    <p onClick={() => handleDelete(product.id)} className='myorder-cancel'>cancel order</p>
                  ) : (
                    /*when deleting in admin coz deleted by id or Add Document id it deletes all product
                    inside that document firebase is made so it deletes whole document can't delete particular items
                    inside that document but here we are just passing id from cartProducts and it is acessible so works for different items in same cart individually*/
                    <p onClick={() => handleWriteReview(item.id)} className='myorder-review'>WRITE A REVIEW</p>
                  )}
                  <p>Shipping Address -</p>
                  <div className='myorder-shipping'>
                    <p>name: {product.name}</p>
                    <p>email: {product.email}</p>
                    <p>mobile: {product.mobile}</p>
                    <p>district: {product.district}</p>
                    <p>full address: {product.address}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      ) : <h4>No Items Ordered</h4>}
      <ConfirmationModal
        isOpen={openModal}
        message={"Are you sure you want to cancel order?"}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ReviewModal
        isVisible={isReviewModalOpen}
        onClose={handleReviewCancel}
        /*passed as prop.This function takes { review, rating } as object when the form is submitted.*/
        handleReviewOnSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default MyOrder;