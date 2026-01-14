import { accessToken, refreshToken } from "@/service/api";

export function checkAuth() {
    if (!accessToken || !refreshToken) {
        return false;
    }
    return true;
}