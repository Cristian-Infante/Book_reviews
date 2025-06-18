import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken(): number | null {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return null;

    try {
        const p = jwtDecode<Record<string, unknown>>(token);

        const raw =
            p.nameid ??
            p.sub ??
            p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
            null;

        const id = Number(raw);
        return Number.isFinite(id) && id > 0 ? id : null;
    } catch {
        return null;
    }
}
