import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./counterSlice.js";

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
  },
});

export default store;
