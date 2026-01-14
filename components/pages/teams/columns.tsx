"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, EllipsisVertical } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog"
import { TeamForm } from "./team-form"
import { teamApi } from "@/service/api"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { Role } from "@/types/user-type"
import { useAuth } from "@/lib/providers/auth-provider"

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
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-xs">{name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{name}</span>
                </div>
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
            const router = useRouter();
            const { user } = useAuth();

            const handleDelete = async (id: string) => {
                try {

                    await teamApi.deleteTeam(id)
                    toast.success("Team deleted successfully")
                    router.refresh()
                } catch (error) {
                    if (error instanceof AxiosError) {
                        toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
                    } else {
                        toast.error("Something went wrong. Please try again.")
                    }
                }
            }


            const [open, setOpen] = useState(false)

            return (
                <>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none">
                            <TeamForm initialData={team} onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <div className="text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors">
                                    <EllipsisVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel><Link href={`/teams/${team.id}`} className="flex items-center gap-2">
                                    View Team <ArrowRight className="w-3 h-3" />
                                </Link></DropdownMenuLabel>
                                {user?.role !== Role.MEMBER && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>
                                            <button className="cursor-pointer" onClick={() => setOpen(true)}>Edit Team</button>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel><button className="cursor-pointer text-red-500" onClick={() => handleDelete(team.id)}>Delete Team</button></DropdownMenuLabel>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>
            )
        }
    }];