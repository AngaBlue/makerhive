import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, fetchUser } from "../api/User";
import AsyncState from "../AsyncState";
import { APIError } from "../api/Error";
import { AppThunk } from "../store";

type UserState = User | null;

const initialState = AsyncState(null as UserState);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.updated = new Date()
      state.data = action.payload;
    },
    getUserFailure: (state, action: PayloadAction<APIError>) => {
      state.error = action.payload;
    },
  },
});

export const {
  getUserStart,
  getUserFailure,
  getUserSuccess,
} = userSlice.actions;

export const getUser = (): AppThunk => async (dispatch) => {
  dispatch(getUserStart());
  const res = await fetchUser();
  if (res.error) dispatch(getUserFailure(res.error));
  if (res.payload) dispatch(getUserSuccess(res.payload));
};

export default userSlice.reducer;