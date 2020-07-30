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
    reservations: Reservation[];
    loans: Loan[];
}

export async function fetchUser(id?: number) {
    return (await request({
        type: "GET_USER",
        payload: id
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

export type EditUserPayload = { id: User["id"], rank: number } & Pick<User, "name" | "email">

export async function editUser(payload: Partial<EditUserPayload>) {
    return (await request({
        type: "PATCH_USER",
        payload
    })) as APIResponse<User>;
}
