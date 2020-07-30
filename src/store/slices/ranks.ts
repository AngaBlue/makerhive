import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";
import { fetchAllRanks, Rank } from "../api/Rank";

type RanksState = Rank[] | null;

const { slice, reducer } = AsyncSlice<RanksState>({ name: "ranks", initialState: null, reducers: {} });

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getRanks = (options?: getAsyncOptions): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchAllRanks();
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload !== undefined) dispatch(getDataSuccess(res.payload));
};

export default reducer;
