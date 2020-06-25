import { Item, fetchItems } from "../api/Item";
import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";

type ItemsState = Item[] | null;

const { slice, reducer } = AsyncSlice<ItemsState>({
    name: "items",
    initialState: null,
    reducers: {}
});

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getUser = (options?: getAsyncOptions): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchItems();
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload) dispatch(getDataSuccess(res.payload));
};

export default reducer;
