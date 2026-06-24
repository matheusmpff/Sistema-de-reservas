const BASE_URL = "http://localhost:3000";

const handle = async (r: Response) => {
    const text = await r.text()
    const data = text ? JSON.parse(text) : {}
    if (!r.ok) throw new Error(data.error ?? "Erro desconhecido")
    return data
}

export const api = {
    get: (path: string) =>
        fetch(`${BASE_URL}${path}`, {
            credentials: "include",
        }).then(handle),

    post: (path: string, body: object) =>
        fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(body),
        }).then(handle),

    patch: (path: string, body: object) =>
        fetch(`${BASE_URL}${path}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(body),
        }).then(handle),

    delete: (path: string) =>
        fetch(`${BASE_URL}${path}`, {
            method: "DELETE",
            credentials: "include",
        }).then(handle),
}