import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { database } from '../Utilities/Configure';
import { collection, getDocs} from 'firebase/firestore';
import statusCode from "../Utilities/statusCode";

/* we are just using this slice to get data from firestore so need 
to store or track any data so no add, delete etc used */
const initialState = {
    data: [],
    status: statusCode.IDLE,
}

const getUsers = createAsyncThunk('users/get', async () => {
    try {
        const querySnapshot = await getDocs(collection(database, 'user'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return data;
    } catch (error) {
        throw error;
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state, action) => {
                state.status = statusCode.LOADING;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = statusCode.IDLE;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.status = statusCode.ERROR;
            });
    }
});

export { getUsers };
export default usersSlice.reducer;