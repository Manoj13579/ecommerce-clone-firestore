import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { database } from '../Utilities/Configure';
import { collection, getDocs, query, orderBy} from 'firebase/firestore';
import statusCode from "../Utilities/statusCode";


const initialState = {
    data: [],
    status:  statusCode.IDLE,
}

const getReview = createAsyncThunk('reviews/get', async () => {
  try {
      // Constructing the query with orderBy on descending order. new first
      const q = query(collection(database, 'review'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => {
          const reviewData = doc.data();
          // Convert the timestamp to an ISO string
          if (reviewData.timestamp) {
              reviewData.timestamp = reviewData.timestamp.toDate().toISOString();
          }
          return { id: doc.id, ...reviewData };
      });

      return data;
  } catch (error) {
      throw error;
  }
});
const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
      addReview: (state, action) => {
        state.data.push(action.payload);
      },
    },
    extraReducers: (builder) => {
      builder
          .addCase(getReview.pending, (state, action) => {
              state.status = statusCode.LOADING;
          })
          .addCase(getReview.fulfilled, (state, action) => {
              state.data = action.payload;
              state.status = statusCode.IDLE;
          })
          .addCase(getReview.rejected, (state, action) => {
              state.status = statusCode.ERROR;
          });
  }
  });
  


  export{ getReview };
export const { addReview } = reviewSlice.actions;
export default reviewSlice.reducer;