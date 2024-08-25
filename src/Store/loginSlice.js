import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    email: null,
    name: null,
    role: null,
    uid: null,
    registrationDate: null,
}


const loginSlice = createSlice({
    name: 'userinfo',
    initialState,
    reducers: {
    SET_ADD_USER_INFO: (state, action) => {
    const{email, name, role, uid, registrationDate, } = action.payload;
    state.email = email;
    state.name = name;
    state.uid = uid;
    state.role = role;
    state.registrationDate= registrationDate;
    },
    SET_REMOVE_USER_INFO: (state, action) => {
        state.email= null,
        state.name= null,
        state.uid= null,
        state.role= null,
        state.registrationDate= null
    }
    }
})


export const { SET_ADD_USER_INFO, SET_REMOVE_USER_INFO } = loginSlice.actions;
export default loginSlice.reducer;