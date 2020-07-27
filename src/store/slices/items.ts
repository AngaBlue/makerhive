import { Item, fetchItems } from "../api/Item";
import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { AsyncState } from "../AsyncState";

type ItemsState = Item[] | null;
const reducers = {
    addItem: (state: AsyncState<ItemsState>, action: PayloadAction<Item>) => {
        if (state.data) state.data.push(action.payload);
        else state.data = [action.payload];
    }
};

const { slice, reducer } = AsyncSlice<ItemsState>({
    name: "items",
    initialState: null,
    reducers: reducers
});

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getItems = (options?: getAsyncOptions): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchItems();
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload) dispatch(getDataSuccess(res.payload));
};

export default reducer;
