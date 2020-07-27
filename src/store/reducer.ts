import { combineReducers } from "@reduxjs/toolkit";

import user from "./slices/user";
import users from "./slices/user";
import items from "./slices/items";
import profile from "./slices/profile";
import loans from "./slices/loans";

const rootReducer = combineReducers({
    user,
    users,
    loans,
    items,
    profile
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
