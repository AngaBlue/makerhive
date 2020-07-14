import { Item } from "./Item";

export interface Loan {
    id: number;
    quantity: number,
    borrowed: string,
    returned?: string,
    note: string
    item: Item
}
