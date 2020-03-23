import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser: (state, action) => state = action.payload,
    }
})

export const { setUser } = userSlice.actions
userSlice.actions.setUser({ name: "user" })


export default userSlice.reducer