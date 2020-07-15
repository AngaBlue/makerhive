import { Item } from "./Item";

export interface Loan {
    id: number;
    quantity: number,
    reserved: string,
    note: string
    item: Item
}
