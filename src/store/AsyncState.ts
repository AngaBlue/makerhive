import { APIError } from "./api/Error";

export interface AsyncState<State> {
    loading: boolean;
    error: APIError | null;
    requested: Date | null;
    data: State;
}

export default function AsyncState<State>(initialState: State): AsyncState<State> {
    return {
        loading: false,
        error: null,
        requested: null,
        data: initialState
    };
}
