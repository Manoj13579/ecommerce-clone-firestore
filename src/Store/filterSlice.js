import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    allProducts: [],
    filteredProducts: [],
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
      setAllProducts: (state, action) => {
        state.allProducts = action.payload;
        state.filteredProducts = action.payload;
      },
      filterProductsByPrice: (state, action) => {
        const lowToHigh = action.payload;
        state.filteredProducts = state.filteredProducts.sort((a, b) => {
          return lowToHigh ? a.price - b.price : b.price - a.price;
        });
      },
    },
  });
  


export const { setAllProducts, filterProductsByPrice } = filterSlice.actions;

export default filterSlice.reducer;