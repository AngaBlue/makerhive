import { combineReducers } from "@reduxjs/toolkit";

import user from "./slices/user";
import items from "./slices/items";
import profile from "./slices/profile";


const rootReducer = combineReducers({
    user,
    items,
    profile
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
