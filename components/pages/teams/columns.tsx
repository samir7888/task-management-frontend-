"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/lib/providers/auth-provider"
import { TeamActions } from "./team-actions"
import Link from "next/link"

export type Team = {
    id: string
    name: string
    created_at: string
}

export const columns: ColumnDef<Team>[] = [
    {
        accessorKey: "name",
        header: "Team Name",
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            return (
                <Link className="flex items-center gap-3 justify-start" href={`/teams/${row.getValue("id")}`}>
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-xs">{name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{name}</span>
                </Link>
            )
        }
    },
    {
        accessorKey: "id",
        header: "Team ID",
        cell: ({ row }) => (
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                {row.getValue("id")}
            </code>
        )
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            const date = row.getValue("created_at") as string
            return (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    {date ? format(new Date(date), "MMM d, yyyy") : "N/A"}
                </div>
            )
        }
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const team = row.original;
            const { user } = useAuth();
            if (!user) return null;



            return (
                <TeamActions team={team} userRole={user?.role} />
            )
        }
    }];