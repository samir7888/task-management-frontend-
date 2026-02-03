'use client'
import { useFetchData } from "@/hooks/useFetchData";
import { TUser } from "@/types/user-type";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AlertCircle } from "lucide-react";
import { TeamResponseType } from "@/types/team-type";


export const MyTeams = ({ user }: { user: TUser }) => {
    const { data: teamsResponse, error, isLoading: isMyTeamsLoading } = useFetchData<TeamResponseType>({
        queryKey: ['my-teams'],
        endpoint: `teams/member/${user?.id}`,

    })
    if (isMyTeamsLoading || !teamsResponse?.teams) {
        return <MyTeamSkeleton />
    }
    if (error) {
        return <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-center">
            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Failed to fetch teams</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm px-6">
                {error.message}
            </p>
        </div>
    }

    return (
        <div className="overflow-hidden">
            <div className="p-1">
                <DataTable columns={columns} data={teamsResponse?.teams} />
            </div>
        </div>
    );
};


const MyTeamSkeleton = () => {
    return (
        <div className="flex  items-center justify-center py-10 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-center">
            <p>Loading...</p>
        </div>
    )
}