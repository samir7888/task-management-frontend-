'use client';
import { TUser } from "@/types/user-type";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi, setApiTokens } from "@/service/api";
import Cookies from "js-cookie";

interface AuthContextType {
    user: TUser | null;
    setUser: (user: TUser | null) => void;
    accessToken: string | null;
    setSession: (accessToken: string | null, refreshToken: string | null) => void;
    refreshToken: string | null;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

interface Props extends PropsWithChildren {
    initialUser?: TUser;
    initialAccessToken?: string;
    initialRefreshToken?: string;
}

export const AuthProvider = ({ children, initialUser, initialAccessToken, initialRefreshToken }: Props) => {
    const [user, setUser] = useState<TUser | null>(initialUser || null);
    const [accessToken, setAccessToken] = useState<string | null>(initialAccessToken || null);
    const [refreshToken, setRefreshToken] = useState<string | null>(initialRefreshToken || null);
    // Hydrate tokens from cookies on mount if not provided by initial props
    useEffect(() => {
        if (!initialAccessToken) {
            const storedAccess = Cookies.get("access_token");
            const storedRefresh = Cookies.get("refresh_token");
            if (storedAccess && storedRefresh) {
                try {
                    const decodedUser: TUser = jwtDecode(storedAccess);
                    setUser(decodedUser);
                    setAccessToken(storedAccess);
                    setRefreshToken(storedRefresh);
                    setApiTokens(storedAccess, storedRefresh);
                } catch (error) {
                    console.error("Failed to decode stored token:", error);
                    logout();
                }
            }
        }
    }, [initialAccessToken]);

    // Sync tokens with API client on mount and whenever they change
    useEffect(() => {
        setApiTokens(accessToken, refreshToken);
    }, [accessToken, refreshToken]);

    const setSession = (accessToken: string | null, refreshToken: string | null) => {
        if (!accessToken || !refreshToken) {
            logout();
        } else {
            try {
                const user: TUser = jwtDecode(accessToken);
                setUser(user);
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setApiTokens(accessToken, refreshToken);

                // Set cookies
                Cookies.set("access_token", accessToken, { expires: 7 }); // 7 days
                Cookies.set("refresh_token", refreshToken, { expires: 30 }); // 30 days
            } catch (error) {
                console.log(error);
                logout();
            }
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setApiTokens(null, null);
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
        }
    };



    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setSession, refreshToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
