import React, { useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { deleteOrder, updateOrder } from '../../Store/userOrder';
import { database } from '../../Utilities/Configure';
import Loader from '../../Utilities/Loader/Loader';
import './Admin.css';
import ConfirmationModal from "../../Utilities/Modal/ConfirmationModal";



const TotalOrder = () => {


const [loading, setLoading] = useState(false);
const myOrders = useSelector(state => state.uorders.data);
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [openStatusModal, setOpenStatusModal] = useState(false);
const [cancelOrderId, setCancelOrderId] = useState(null);
const [statusChangeId, setStatusChangeId] = useState(null);

// for S.No
let totalCount = 0;
const dispatch = useDispatch();
/* In updating loading status as  if (status === statusCode.LOADING)  doesnot work .only works in getting products
 coz that's how it is set in thunk creator in redux store. others than get could only be used
 onside using ? </ Loader> or other approach. we can use one setLoading in component for all other than get. it
 only shows jsx after that function or action*/

const handleDelete = async (id) => {
  setOpenDeleteModal(true);
  setCancelOrderId(id)
}
const handleConfirmOrderDelete = async () => {
    try {
      setLoading(true);
      const deleteVal = doc(database, "userorder", cancelOrderId);
      await deleteDoc(deleteVal);
      dispatch(deleteOrder({ id:cancelOrderId }));
      toast.success("order deleted successfully");
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(
        "An error occurred while deleting the product. Please try again."
      );
      }
    setLoading(false);
    setOpenDeleteModal(false);
    setCancelOrderId(null);
};
const handleCancelOrderDelete = () => {
  setOpenDeleteModal(false);
  setCancelOrderId(null);
}
const handleStatusChange = async (id) => {
  setOpenStatusModal(true);
  setStatusChangeId(id)
}
const handleConfirmOrderStatus = async () => {

    try {
      setLoading(true);
      const editDoc = doc(database, "userorder", statusChangeId);
      await updateDoc(editDoc, {
        status: "delivered",
      });
      dispatch(
        updateOrder({
          id: statusChangeId,
          status: "delivered",
        })
      );
      toast.success("status changed to delivered");
    } catch (error) {
      toast.error(error);
    }
    setLoading(false);
    setOpenStatusModal(false);
    setCancelOrderId(null);
  }
  const handleCancelOrderStatus = ()=> {
   setOpenStatusModal(false);
   setStatusChangeId(null);
  }


  return (<>
    {loading && <Loader />}
    <section className="totalorder-container">
      <h5>All Order</h5>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Order ID</th>
            <th>Product</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Ordered Qty</th>
            <th>Remaining Qty</th>
            <th>Ordered On</th>
            <th>User</th>
            <th>Email</th>
            <th>Status</th>
            <th>Address</th>
            <th>Mobile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {myOrders.slice().sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate)).map((product) => ( 
            product.cartProducts.map((item, itemIndex) => {
              totalCount++;
              /* we are using  totalCount++; and dont want to return this 
              so are using this format oterwise just () had worked no need to
              => { and return(*/
              return(
              <tr key={`${product.id}-${itemIndex}`}>
                <td>{totalCount}</td>
                <td>{product.id}</td>
                <td><img src={item.image} alt="" style={{ width: '16%' }} /></td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td>{item.orderedQuantity}</td>
                <td>{item.quantity - item.orderedQuantity}</td>
                <td>{product.OrderDate}</td>
                <td>{product.name}</td>
                <td>{product.email}</td>
                <td> <div className="totalorder-dropdown">
      <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {product.status}
      </button>
      <ul className="dropdown-menu">
        <li onClick={() => handleStatusChange(product.id)} className='dropdown-item'>Delivered</li>
      </ul>
    </div></td>
                <td>{product.address}</td>
                <td>{product.mobile}</td>
                <td><button onClick={() => handleDelete(product.id)}className='totalorder-button-delete'>Delete Order</button></td>
              </tr>
            )})
          ))}
        </tbody>
      </table>
    </section>
    {/* passing props to  ConfirmationModal*/}
    <ConfirmationModal
    isOpen={openDeleteModal}
    message={"Are you sure you want to delete order?"}
    onConfirm={handleConfirmOrderDelete}
    onCancel={handleCancelOrderDelete}

    />
    <ConfirmationModal
    isOpen={openStatusModal}
    message={"Are you sure you want to change status to delivered"}
    onConfirm={handleConfirmOrderStatus}
    onCancel={handleCancelOrderStatus}

    />
    </>
  );
};

export default TotalOrder;