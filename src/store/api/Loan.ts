import { Item } from "./Item";
import { request, APIResponse } from "./api";

export interface Loan {
    id: number;
    quantity: number,
    borrowed: string,
    returned?: string,
    note: string
    item: Item
}

export async function fetchAllLoans() {
    return (await request({
        type: "GET_ALL_LOANS"
    })) as APIResponse<Loan[]>;
}