import { Rank } from "./Rank";
import { Reservation } from "./Reservation";

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
    reservations: Reservation[]
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

export async function fetchAllUsers() {
    return (await request({
        type: "GET_ALL_USERS"
    })) as APIResponse<User[]>;
}
