/* eslint-disable no-throw-literal */
import { APIError } from "./Error";

let reqID = 0;

export async function request(req: APIRequest) {
    let body = {
        id: reqID++,
        ...req
    };
    try {
        let response: APIResponse<any> = await (
            await fetch("https://makerhive.anga.blue/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(body)
            })
        ).json();
        return response;
    } catch (error) {
        console.error(error);
        return {
            id: body.id,
            type: body.type,
            error: {
                name: "API Error",
                message: "Unknown API error"
            }
        } as APIResponse<undefined>;
    }
}

interface APIRequest {
    type: string;
    payload?: any;
}

export interface APIResponse<payload> {
    id: number;
    type: string;
    payload?: payload;
    error?: APIError;
}
