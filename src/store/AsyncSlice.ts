import { createSlice, PayloadAction, Draft, SliceCaseReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { APIError } from "./api/Error";
import storage from "redux-persist/lib/storage";

interface AsyncState<State> {
    loading: boolean;
    error: APIError | null;
    requested: Date | null;
    data: State;
}

/* Generic Async Slice
 * Stores Data with Asynchronous State
 * 4 States Possible: No data, Requested, Errored, Success
 */

export default function AsyncSlice<State>(slice: {
    name: string;
    initialState: State;
    reducers: SliceCaseReducers<AsyncState<State>>;
}) {
    const initialState: AsyncState<State> = {
        loading: false,
        error: null,
        requested: null,
        data: slice.initialState
    };
    const asyncSlice = createSlice({
        name: slice.name,
        initialState,
        reducers: {
            getDataStart: (state) => {
                state.loading = true;
                state.error = null;
                state.requested = new Date();
            },
            getDataSuccess: (state, action: PayloadAction<Draft<State>>) => {
                state.loading = false;
                state.data = action.payload;
            },
            getDataFailure: (state, action: PayloadAction<APIError>) => {
                state.error = action.payload;
            },
            ...slice.reducers
        }
    });
    return {
        reducer: persistReducer(
            {
                key: `makerhive-${slice.name}`,
                storage,
                blacklist: ["loading", "requested", "error"]
            },
            asyncSlice.reducer
        ),
        slice: asyncSlice
    };
}

//Throttles Requests to ensure more requests aren't sent multiple times
export function throttle(requested: AsyncState<any>["requested"], timeout: number): boolean {
    //If Requested Time + Throttle Time > Current Time: Throttle
    if (requested && requested.getTime() + timeout > Date.now()) return true;
    else return false;
}

export type getAsyncOptions = {
    throttle?: {
        requested: AsyncState<any>["requested"];
        timeout: number;
    };
};
