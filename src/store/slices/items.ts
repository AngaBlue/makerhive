import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item, fetchItems } from "../api/Item";
import AsyncState from "../AsyncState";
import { APIError } from "../api/Error";
import { AppThunk } from "../store";

type ItemsState = Item[] | null;

const initialState = AsyncState(null as ItemsState);

const userSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    getItemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getItemsSuccess: (state, action: PayloadAction<ItemsState>) => {
      state.loading = false;
      state.updated = new Date()
      state.data = action.payload;
    },
    getItemsFailure: (state, action: PayloadAction<APIError>) => {
      state.error = action.payload;
    },
  },
});

export const {
  getItemsStart,
  getItemsFailure,
  getItemsSuccess,
} = userSlice.actions;

export const getUser = (): AppThunk => async (dispatch) => {
  dispatch(getItemsStart());
  const res = await fetchItems();
  if (res.error) dispatch(getItemsFailure(res.error));
  if (res.payload) dispatch(getItemsSuccess(res.payload));
};

export default userSlice.reducer;
