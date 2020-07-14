import { APIError } from "./Error";
import { notification } from "antd";

let reqID = 0;

export async function request(req: APIRequest, image?: Blob) {
    let body = {
        id: reqID++,
        ...req
    };
    let data: string | FormData;
    let headers: Record<string, string> = {};
    if (image) {
        let formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(body));
        data = formData;
    } else {
        data = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
    }
    try {
        let response: APIResponse<any> = await (
            await fetch("https://makerhive.anga.blue/api", {
                method: "POST",
                headers: headers,
                credentials: "include",
                body: data
            })
        ).json();
        return response;
    } catch (error) {
        console.error(error);
        notification.error({
            placement: "bottomRight",
            message: "Connection Error",
            description: "An error occurred whilst communicating with the server."
        });
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

export interface APIRequest {
    type: string;
    payload?: any;
}

export interface APIResponse<payload> {
    id: number;
    type: string;
    payload?: payload;
    error?: APIError;
}
