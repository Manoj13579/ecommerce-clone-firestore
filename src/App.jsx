import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Pages
import Layout from "./Components/Layout.jsx";
import Cart from "./Components/Cart.jsx";
import AddCart from "./Pages/AddCart.jsx";
import Search from "./Components/Search.jsx";
import Carousel from "./Pages/Carousel.jsx";
import ImageCategory from "./Pages/ImageCategory.jsx";
import Category from "./Pages/Category.jsx";
import SideMenuPage from "./Pages/SideMenuPage.jsx";
import Register from "./Pages/Auth/Register.jsx";
import Reset from "./Pages/Auth/Reset.jsx";
import Login from "./Pages/Auth/Login.jsx";
import MyOrder from "./Components/MyOrder.jsx";
import UserProtectedRoute from "./Components/ProtectedRoute/UserProtectedRoute.jsx";
import AdminProtectedRoute from "./Components/ProtectedRoute/AdminProtectedRoute.jsx";
import NotFound from "./Pages/NotFound.jsx";
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import TotalUsers from "./Pages/Admin/TotalUsers.jsx";
import TotalProduct from "./Pages/Admin/TotalProduct.jsx";
import TotalOrder from "./Pages/Admin/TotalOrder.jsx";
import AdminProductHandle from "./Pages/Admin/AdminProductHandle.jsx";
import Order from "./Components/Order.jsx";
import Seller from "./Pages/seller/Seller.jsx";



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Layout />}>
      <Route
        index
        element={
          <>
            <Carousel />
            <ImageCategory />
            <Category />
          </>
        }
      />
      <Route path="search" element={<Search />} />
      <Route path="sidemenupage/:category" element={<SideMenuPage />} />
      <Route path="addcart/:id" element={<AddCart />} />
      <Route path="seller" element={<Seller />} />
      <Route element={<UserProtectedRoute />}>
      <Route path="cart" element={<Cart />} />
      <Route path="reset" element={<Reset />} />
      </Route>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="myorder" element={<MyOrder />} />
      <Route path="order" element={<Order />} />
    </Route>
    <Route element={<AdminProtectedRoute />}>
      <Route path="adminlayout" element={<AdminLayout />}>
      <Route index element ={<TotalProduct />}/>
      <Route path="totalorder" element={<TotalOrder />} />
      <Route path="totalusers" element={<TotalUsers />} />
      </Route>
      <Route path="adminproducthandle" element={<AdminProductHandle />} />
    </Route>
      <Route path="*" element={<NotFound />} />
      </>
  )
);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
