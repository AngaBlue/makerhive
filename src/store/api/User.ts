import { Rank } from "./Rank";
import { request, APIResponse } from "./api";

export interface User {
    id: number;
    name: string;
    email: string;
    joined: string;
    image: string;
    rank: Rank;
}

export async function fetchUser() {
    return (await request({
        type: "GET_USER"
    })) as APIResponse<User>;
}
