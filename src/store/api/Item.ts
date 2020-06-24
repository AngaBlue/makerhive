import { request, APIResponse } from "./api";

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

export async function fetchItems() {
  return (await request({
    type: "GET_ALL_ITEMS",
  })) as APIResponse<Item[]>;
}
