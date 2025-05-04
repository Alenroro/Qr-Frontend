import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await axios.get(
      "https://qr-backend-application.onrender.com/cart/items"
    );
    return response.data;
  }
);

export const updateCartItems = createAsyncThunk(
  "cart/updateCartItems",       
  async ({ id, updatedItems, updatedCombos }, { dispatch }) => {
    try {
      await axios.put(
        ` https://qr-backend-application.onrender.com/cart/cartitems/:${id}`,
        {
          updatedItems,
          updatedCombos,
        }
      );
      dispatch(fetchCartItems());
    } catch (error) {
      console.error("Error response:", error.response);
      throw new Error(error.response ? error.response.data : error.message);
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    selectedIndex: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
    resetSelectedIndex: (state) => {
      state.selectedIndex = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItems.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedIndex, resetSelectedIndex } = cartSlice.actions;

export default cartSlice.reducer;
