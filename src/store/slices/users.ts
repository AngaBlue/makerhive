import { User, fetchAllUsers } from "../api/User";
import { AppThunk } from "../store";
import AsyncSlice, { getAsyncOptions, throttle } from "../AsyncSlice";

type UsersState = User[] | null;

const { slice, reducer } = AsyncSlice<UsersState>({ name: "users", initialState: null, reducers: {} });

export const { getDataStart, getDataFailure, getDataSuccess } = slice.actions;

export const getUsers = (options?: getAsyncOptions): AppThunk => async (dispatch) => {
    if (options) {
        if (options.throttle && throttle(options.throttle.requested, options.throttle.timeout)) return;
    }
    dispatch(getDataStart());
    const res = await fetchAllUsers();
    if (res.error) dispatch(getDataFailure(res.error));
    if (res.payload !== undefined) dispatch(getDataSuccess(res.payload));
};

export default reducer;
