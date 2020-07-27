import { request, APIResponse } from "./api";
import { Reservation } from "./Reservation";
import { Loan } from "./Loan";

export interface Item {
    id: number;
    name: string;
    description: string;
    quantity: number;
    image: string;
    hidden: boolean;
    location: string;
    available: string;
}

export interface DetailedItem extends Item {
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
        type: "GET_ITEM_DETAILS",
        payload: id
    })) as APIResponse<DetailedItem>;
}

export async function fetchItem(id: Item["id"]) {
    return (await request({
        type: "GET_ITEM",
        payload: id
    })) as APIResponse<Item>;
}

export async function addItem(item: Item, image?: Blob) {
    return (await request(
        {
            type: "POST_ITEM",
            payload: item
        },
        image
    )) as APIResponse<Item>;
}

export async function editItem(changes: Partial<Item>, image?: Blob) {
    return (await request(
        {
            type: "PATCH_ITEM",
            payload: changes
        },
        image
    )) as APIResponse<Item>;
}
