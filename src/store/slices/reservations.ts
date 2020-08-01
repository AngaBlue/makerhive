import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";
import { fetchAllReservations, AdminReservation } from "../api/Reservation";
import { PayloadAction } from "@reduxjs/toolkit";

type ReservationsState = AdminReservation[] | null;

const { slice, reducer } = AsyncSlice<ReservationsState>({
    name: "reservations",
    initialState: null,
    reducers: {
        removeReservation: (state, action: PayloadAction<AdminReservation["id"]>) => {
            if (!state.data) return state;
            state.data.splice(
                state.data.findIndex((r) => r.id === action.payload),
                1
            );
            return state;
        }
    }
});

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getReservations = (options?: getAsyncOptions): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchAllReservations();
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload !== undefined) dispatch(getDataSuccess(res.payload));
};

export default reducer;
