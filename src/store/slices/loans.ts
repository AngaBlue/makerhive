import { fetchAllLoans, AdminLoan } from "../api/Loan";
import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";
import { PayloadAction } from "@reduxjs/toolkit";

type LoansState = AdminLoan[] | null;

const { slice, reducer } = AsyncSlice<LoansState>({
    name: "loans",
    initialState: null,
    reducers: {
        removeLoan: (state, action: PayloadAction<AdminLoan["id"]>) => {
            if (!state.data) return state;
            state.data.splice(
                state.data.findIndex((l) => l.id === action.payload),
                1
            );
            return state;
        }
    }
});

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getLoans = (options?: getAsyncOptions): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchAllLoans();
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload !== undefined) dispatch(getDataSuccess(res.payload));
};

export default reducer;
