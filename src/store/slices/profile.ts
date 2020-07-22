import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";
import { fetchUserProfile, UserProfile, User } from "../api/User";
import { PayloadAction } from "@reduxjs/toolkit";
import { Reservation } from "../api/Reservation";

type ProfileState = UserProfile | null;

const { slice, reducer } = AsyncSlice<ProfileState>({
    name: "profile",
    initialState: null,
    reducers: {
        removeReservation: (state, action: PayloadAction<Reservation["id"]>) => {
            if (!state.data) return state;
            state.data.reservations.splice(
                state.data.reservations.findIndex((r) => r.id === action.payload),
                1
            );
        }
    }
});

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getProfile = (options: getAsyncOptions & { payload: User["id"] }): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchUserProfile(options.payload);
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload !== undefined) dispatch(getDataSuccess(res.payload));
};

export default reducer;
