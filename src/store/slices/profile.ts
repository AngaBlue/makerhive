import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";
import { fetchUserProfile, UserProfile, User } from "../api/User";
import { PayloadAction } from "@reduxjs/toolkit";
import { Reservation } from "../api/Reservation";
import { Loan } from "../api/Loan";

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
        },
        removeLoan: (state, action: PayloadAction<Reservation["id"]>) => {
            if (!state.data) return state;
            state.data.loans.splice(
                state.data.loans.findIndex((l) => l.id === action.payload),
                1
            );
        },
        addLoan: (state, action: PayloadAction<Loan>) => {
            if (!state.data) return state;
            return { ...state, data: { ...state.data, loans: [action.payload, ...state.data.loans] } };
        },
        addReservation: (state, action: PayloadAction<Reservation>) => {
            if (!state.data) return state;
            return { ...state, data: { ...state.data, reservations: [action.payload, ...state.data.reservations] } };
        }
    }
});

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getProfile = (options: getAsyncOptions & { payload: User["id"] }): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    console.log("Fetching Profile")
    dispatch(getDataStart());
    const res = await fetchUserProfile(options.payload);
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload !== undefined) dispatch(getDataSuccess(res.payload));
};

export default reducer;
