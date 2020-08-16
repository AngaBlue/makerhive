import { configureStore, Action } from "@reduxjs/toolkit";
import thunk, { ThunkAction } from "redux-thunk";
import rootReducer, { RootState } from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//Persist State to LocalStore to Cache API responses for instant load times.
const persistConfig = {
    key: "state",
    storage,
    whitelist: []
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
