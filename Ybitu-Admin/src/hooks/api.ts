const BASE_URL = "http://localhost:3000";

export const api = {
    get: (path: string) =>
        fetch(`${BASE_URL}${path}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((r) => r.json()),

    post: (path: string, body: object) =>
        fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(body),
        }).then((r) => r.json()),

    patch: (path: string, body: object) =>
        fetch(`${BASE_URL}${path}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(body),
        }).then((r) => r.json()),

    delete: (path: string) =>
        fetch(`${BASE_URL}${path}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
};