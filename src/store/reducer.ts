import { combineReducers } from "@reduxjs/toolkit";

import user from "./slices/user";
import users from "./slices/users";
import items from "./slices/items";
import profile from "./slices/profile";
import loans from "./slices/loans";
import reservations from "./slices/reservations";
import ranks from "./slices/ranks";

//Combine All difference slices into one central store

const rootReducer = combineReducers({
    user,
    users,
    loans,
    items,
    profile,
    ranks,
    reservations
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
