import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice.js";
import productSlice from "./productSlice.js";
import filterSlice from "./filterSlice.js";
import loginSlice from "./loginSlice.js";
import orderSlice from "./userOrder.js";
import usersSlice from "./getusersSlice.js";
import reviewSlice from "./reviewSlice.js";

const Store = configureStore({
    reducer: {
        cart: cartSlice,
        products: productSlice,
        filter: filterSlice,
        userinfo: loginSlice,
        uorders: orderSlice,
        users: usersSlice,
        reviews: reviewSlice,
    }
});


export default Store;