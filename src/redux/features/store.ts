import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {},
  preloadedState: {},
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
