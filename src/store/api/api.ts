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
    //Add Relevant Request Headers
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
        //Send Request, Return Response
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
        //Error Whilst Making Request: Connection Error
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
                name: "Connection Error",
                message: "An error occurred whilst communicating with the server."
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
