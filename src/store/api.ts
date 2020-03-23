import { store } from "../index";

export function request(data: APIRequest[]) {
    fetch("https://makerhive.anga.blue/api", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then((responses: {
            endpoint: string;
            payload?: any
        }[]) => {
            store.dispatch({
                type: "user/setUser",
                payload: { numpty: "yes"}
            })
            for (let response of responses) {
                //Handle Responses
                let types: { [index: string]: string } = {
                    "GET_USER": "user/setUser"
                }
                let type = types[response.endpoint]
                if (!type) continue;
                store.dispatch({
                    type,
                    payload: response.payload
                })
            }
        });
}

interface APIRequest {
    endpoint: string;
    payload?: any
}