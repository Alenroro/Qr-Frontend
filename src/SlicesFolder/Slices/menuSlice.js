import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageUrls: [],
  categoryImages: [],
  foodItemImages: [],
  updatedItems: [], // Items with counts and prices
  orderedFood: [], // Ordered food items
  loading: true,
  showBottomNavbar: false,
  selectedTable: null,
  additionalItems: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setImageUrls(state, action) {
      state.imageUrls = action.payload;
    },
    setSelectedTable(state, action) {
      state.selectedTable = action.payload;
    },
    setCategoryImages(state, action) {
      state.categoryImages = action.payload;
    },
    setFoodItemImages(state, action) {
      state.foodItemImages = action.payload;
    },
    setUpdatedItems(state, action) {
      state.updatedItems = action.payload;
      const orderedItems = action.payload.filter((item) => item.count > 0);
      state.orderedFood = orderedItems;
      state.showBottomNavbar = orderedItems.length > 0;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    updateCartItemCount(state, action) {
      const { name, delta } = action.payload;
      state.updatedItems = state.updatedItems.map((item) =>
        item.name === name
          ? { ...item, count: Math.max(0, item.count + delta) }
          : item
      );
      const orderedItems = state.updatedItems.filter((item) => item.count > 0);
      state.orderedFood = orderedItems;
      state.showBottomNavbar = orderedItems.length > 0;
    },
    setAdditionalItems: (state, action) => {

      state.additionalItems = action.payload;
    },
  },
});

export const {
  setImageUrls,
  setSelectedTable,
  setCategoryImages,
  setFoodItemImages,
  setUpdatedItems,
  setLoading,
  updateCartItemCount,
  setAdditionalItems,
} = menuSlice.actions;

export default menuSlice.reducer;