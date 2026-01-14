'use client';
import { useAuth } from "@/lib/providers/auth-provider";
import { authApi } from "@/service/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const { login } = authApi;
    const { setSession } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('basnetsameer3211@gmail.com');
    const [password, setPassword] = useState('password123');
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await login({ email, password });
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-5">Login</h1>
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded p-2" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded p-2" />
                    <button className="bg-blue-500 text-white p-2 rounded" type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                </form>
            </div>
        </div>
    )
}