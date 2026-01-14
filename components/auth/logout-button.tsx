'use client';
import { authApi } from "@/service/api";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authApi.logout();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-lg"
        >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
        </Button>
    );
}
