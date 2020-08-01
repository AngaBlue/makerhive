import { Item } from "./Item";
import { APIResponse, request } from "./api";
import { User } from "./User";

export interface Reservation {
    id: number;
    quantity: number;
    reserved: string;
    note: string;
    item: Item;
    position: number;
}

export interface AdminReservation extends Reservation {
    user: User;
}

export async function deleteReservation(id: Reservation["id"]) {
    return (await request({
        type: "DELETE_RESERVATION",
        payload: id
    })) as APIResponse<undefined>;
}

export async function fetchAllReservations() {
    return (await request({
        type: "GET_ALL_RESERVATIONS"
    })) as APIResponse<AdminReservation[]>;
}

export async function reserveItem(
    reservation: {
        item: number;
        quantity: number;
        note?: string;
    },
    image?: Blob
) {
    return (await request(
        {
            type: "POST_RESERVE_ITEM",
            payload: reservation
        },
        image
    )) as APIResponse<Reservation>;
}
