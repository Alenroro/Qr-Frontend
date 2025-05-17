import { configureStore } from "@reduxjs/toolkit";
// import userLoginSlice from "./Slices/userLoginSlice";
// import userProfileSlice from "./Slices/userProfileSlice";
import menuReducer from './Slices/menuSlice';
import cartReducer from './Slices/kitchenSlice';

export default configureStore({
    reducer:{
        // userLogin: userLoginSlice,
        // profile: userProfileSlice,
        menu: menuReducer,
        cart: cartReducer,

    }
})