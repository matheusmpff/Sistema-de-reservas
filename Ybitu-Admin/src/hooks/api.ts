// Camada de acesso à API. Todas as rotas (exceto /user/login e /user/)
// precisam do header Authorization: Bearer <token>.

const BASE_URL = "http://localhost:3000";

function getToken() {
    return localStorage.getItem("token");
}

async function request(path: string, options: RequestInit = {}) {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    // Token inválido/expirado → limpa sessão e redireciona para login
    if (res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    return res;
}

// Cliente http genérico (preserva interface original usada nas páginas)
export const api = {
    get: (path: string) => request(path),
    post: (path: string, body: object) =>
        request(path, { method: "POST", body: JSON.stringify(body) }),
    patch: (path: string, body: object) =>
        request(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (path: string) => request(path, { method: "DELETE" }),
};

// Helpers para converter resposta em JSON com tratamento de erro
export async function apiJson<T = any>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = `Erro ${res.status}`;
        try { const b = await res.json(); msg = b.erro ?? b.error ?? b.msg ?? msg; } catch { }
        throw new Error(msg);
    }
    if (res.status === 204) return null as T;
    return res.json();
}
