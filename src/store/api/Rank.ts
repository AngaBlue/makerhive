import { request, APIResponse } from "./api";

export interface Rank {
    id: number;
    name: string;
    permissions: number;
}

export async function fetchAllRanks() {
    return (await request({
        type: "GET_ALL_RANKS"
    })) as APIResponse<Rank[]>;
}
