import { Item } from "./Item";
import { APIResponse, request } from "./api";

export interface Reservation {
    id: number;
    quantity: number;
    reserved: string;
    note: string;
    item: Item;
    position: number;
}

export async function deleteReservation(id: Reservation["id"]) {
    return (await request({
        type: "DELETE_RESERVATION",
        payload: id
    })) as APIResponse<undefined>;
}
