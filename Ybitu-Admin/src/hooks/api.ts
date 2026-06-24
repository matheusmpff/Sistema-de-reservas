const BASE_URL = "http://localhost:3000";

export const api = {
    get: (path: string) =>
        fetch(`${BASE_URL}${path}`, {
            credentials: "include", // manda o cookie automaticamente
        }).then((r) => r.json()),

    post: (path: string, body: object) =>
        fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(body),
        }).then((r) => r.json()),

    patch: (path: string, body: object) =>
        fetch(`${BASE_URL}${path}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(body),
        }).then((r) => r.json()),

    delete: (path: string) =>
        fetch(`${BASE_URL}${path}`, {
            method: "DELETE",
            credentials: "include",
        }),
};