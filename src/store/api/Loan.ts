import { Item } from "./Item";
import { request, APIResponse } from "./api";
import { User } from "./User";

export interface Loan {
    id: number;
    quantity: number;
    borrowed: string;
    returned?: string;
    note: string;
    item: Item;
}

export interface AdminLoan extends Loan {
    user: User;
}

export async function fetchAllLoans() {
    return (await request({
        type: "GET_ALL_LOANS"
    })) as APIResponse<AdminLoan[]>;
}

export async function loanItem(
    loan: {
        item: number;
        quantity: number;
        note?: string;
    },
    image?: Blob
) {
    return (await request(
        {
            type: "POST_LOAN_ITEM",
            payload: loan
        },
        image
    )) as APIResponse<Loan>;
}

export async function returnLoan(id: number) {
    return (await request({
        type: "PATCH_RETURN_LOAN",
        payload: id
    })) as APIResponse<Loan>;
}
