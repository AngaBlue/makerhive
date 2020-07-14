import { Rank } from "./Rank";
import { request, APIResponse } from "./api";
import { Loan } from "./Loan";

export interface User {
    id: number;
    name: string;
    email: string;
    joined: string;
    image: string;
    rank: Rank;
}

export interface UserProfile extends User {
    reservations: string[]
    loans: Loan[]
}

export async function fetchUser() {
    return (await request({
        type: "GET_USER"
    })) as APIResponse<User>;
}

export async function fetchUserProfile(payload: User["id"]) {
    return (await request({
        type: "GET_USER_PROFILE",
        payload
    })) as APIResponse<UserProfile>;
}
