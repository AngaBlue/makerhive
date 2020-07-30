import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";
import { Reservation, fetchAllReservations } from "../api/Reservation";

type ReservationsState = Reservation[] | null;

const { slice, reducer } = AsyncSlice<ReservationsState>({ name: "loans", initialState: null, reducers: {} });

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getLoans = (options?: getAsyncOptions): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchAllReservations();
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload !== undefined) dispatch(getDataSuccess(res.payload));
};

export default reducer;
