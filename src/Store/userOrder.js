import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { database } from '../Utilities/Configure';
import { collection, getDocs} from 'firebase/firestore';
import statusCode from "../Utilities/statusCode";


const initialState = {
    data: [],
    status: statusCode.IDLE,
}
/* "uorders/get". This follows the pattern of prefixing action types 
with the slice name ("uorders") to make them unique and identifiable within
 the Redux store. just a convevtion can name anything. not going to use
 this name anywhere. we will only need getOrders*/
const getOrders = createAsyncThunk('uorders/get', async () => {
    try {
        const querySnapshot = await getDocs(collection(database, 'userorder'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return data;
    } catch (error) {
        throw error;
    }
});


const orderSlice = createSlice({
    name: 'uorders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.data.push(action.payload)
        },
        deleteOrder: (state, action) => {
           state.data = state.data.filter(d => d.id!== action.payload.id)
        },
        updateOrder: (state, action) => {
            const updateOrder = state.data.find(ind => ind.id === action.payload.id)
            if (updateOrder) {
                /* can also use ...state.data  while direct modification of the state works due to JavaScript's mutability, using the spread operator for updates ensures immutability and aligns with Redux best practices, leading to more maintainable and predictable code.*/
                    updateOrder.status= action.payload.status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state, action) => {
                state.status = statusCode.LOADING;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = statusCode.IDLE;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.status = statusCode.ERROR;
            });
    }
});

export { getOrders };
export const { addOrder, deleteOrder, updateOrder } = orderSlice.actions;
export default orderSlice.reducer;