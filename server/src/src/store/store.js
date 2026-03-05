
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import rootReducer from "../Reducer/index";

//  Persist ONLY course slice
const persistConfig = {
  key: "root",
  storage,
   whitelist: [ "courseProgress"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // REQUIRED for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
