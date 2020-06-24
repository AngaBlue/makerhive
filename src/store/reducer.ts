import { combineReducers } from "@reduxjs/toolkit";

import user from "./slices/user";
import items from "./slices/items";

const rootReducer = combineReducers({
    user,
    items
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer