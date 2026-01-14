'use client'
import { authApi } from "@/service/api";
import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Signup() {
    const { register } = authApi;
    const { setSession } = useAuth();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();


    useEffect(() => {
        handleSubmit();
    }, [])
    const handleSubmit = async () => {
        try {
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
            console.log(error);
        }
    }
    return (
        <div className="flex items-center flex-col justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-5">Please wait...</h1>




        </div>
    )
}