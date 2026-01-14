'use client'
import { authApi } from "@/service/api";
import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Signup() {
    const { register } = authApi;
    const { setSession } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    const [name, setName] = useState('');
    const [email, setEmail] = useState(emailParam || '');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await register({ email, password, name, token: token || undefined });
            if (res.access_token && res.refresh_token) {
                setSession(res.access_token, res.refresh_token);
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex items-center flex-col justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-5">Sign Up</h1>
            {token ? (
                <p className="text-blue-600 font-medium">Joining team as {email}</p>
            ) : (
                <p>Sign up to create an account</p>
            )}
            <div className="flex mt-12 flex-col items-center justify-center">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded p-2" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!token} className="border border-gray-300 rounded p-2" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded p-2" />
                    <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded">{isLoading ? 'Signing up...' : 'Sign Up'}</button>
                </form>
            </div>
        </div>
    )
}