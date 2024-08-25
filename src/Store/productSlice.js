import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { database } from '../Utilities/Configure';
import { collection, getDocs} from 'firebase/firestore';
import statusCode from "../Utilities/statusCode";


const initialState = {
    data: [],
    status: statusCode.IDLE,
}

const getProducts = createAsyncThunk('products/get', async () => {
    try {
        const querySnapshot = await getDocs(collection(database, 'daraazdata'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return data;
    } catch (error) {
        throw error;
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action) => {
            state.data.push(action.payload)
        },
        deleteProduct: (state, action) => {
           state.data = state.data.filter(d => d.id!== action.payload.id)
        },
        /*state: Represents the current state of the Redux slice.
        action: Represents the action dispatched to trigger this reducer, containing payload with updated product details.
        state.data.find: Uses find to find the id of the product in state.data array that matches action.payload.id.
        */
        updateProduct: (state, action) => {
            const productUpdate = state.data.find(ind => ind.id === action.payload.id);
            // if productUpdate true in state.data at the found index.
            // If no elements satisfy the testing function, it returns undefined.
            /* redux considers using findIndex better or in complex app, real app it distinguishes product in clear way coz it ensures only first matched item  is returned even it is of
            same id .better when we may have to ids in same array. when used on items from
            firestore no need it always has different id . sometimes in local use we may use it on same id
            items but neet operation on single one of same id */
            if (productUpdate) {
                // Updates id, title, description, category, image, price, quantity, and registrationDate fields with values from action.payload.
                productUpdate.id= action.payload.id;
                productUpdate.title= action.payload.title;
                productUpdate.description= action.payload.description;
                productUpdate.category= action.payload.category;
                productUpdate.image= action.payload.image;
                productUpdate.price= action.payload.price;
                productUpdate.quantity= action.payload.quantity;
                productUpdate.registrationDate= action.payload.registrationDate;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state, action) => {
                state.status = statusCode.LOADING;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = statusCode.IDLE;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.status = statusCode.ERROR;
            });
    }
});

export { getProducts };
export const { addProduct, deleteProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
