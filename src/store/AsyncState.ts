import { APIError } from "./api/Error";

interface AsyncState<State> {
    loading: boolean,
    error: APIError | null,
    updated: Date | null,
    data: State
}

export default function AsyncState<State>(initialState: State): AsyncState<State> {
    return {
        loading: false,
        error: null,
        updated: null,
        data: initialState
    }
}