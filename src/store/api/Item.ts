import { request, APIResponse } from "./api";
import { Reservation } from "./Reservation";
import { Loan } from "./Loan";

export interface Item {
    id: number;
    name: string;
    description: string;
    quantity: number;
    image: string;
    hidden: number;
    location: string;
    available: string;
}

export interface DetailedItem {
    id: number;
    name: string;
    description: string;
    quantity: number;
    image: string;
    hidden: number;
    location: string;
    available: string;
    reservations: Reservation[];
    loans: Loan[];
}

export async function fetchItems() {
    return (await request({
        type: "GET_ALL_ITEMS"
    })) as APIResponse<Item[]>;
}

export async function fetchDetailedItem(id: Item["id"]) {
    return (await request({
        type: "GET_ITEM_DETAILED",
        payload: id
    })) as APIResponse<DetailedItem>;
}

export async function fetchItem(id: Item["id"]) {
    return (await request({
        type: "GET_ITEM",
        payload: id
    })) as APIResponse<Item>;
}
