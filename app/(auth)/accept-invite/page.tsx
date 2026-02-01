'use client'
import { authApi } from "@/service/api";
import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AxiosError } from "axios";

export default function Signup() {
    const { setSession } = useAuth();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        handleSubmit();
    }, [])
    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (token) {
                const res = await authApi.acceptInvite({ token });

                // If backend returns tokens (user already logged in maybe?), set session
                if (res.access_token && res.refresh_token) {
                    setSession(res.access_token, res.refresh_token);
                }

                if (res.redirect) {
                    router.push(res.redirect);
                } else {
                    router.push('/');
                }
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data.message);
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex items-center flex-col justify-center min-h-screen">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}




        </div>
    )
}