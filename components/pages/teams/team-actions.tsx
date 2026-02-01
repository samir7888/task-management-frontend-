"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { teamApi } from "@/service/api"
import { Role } from "@/types/user-type"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { TeamForm } from "./team-form"

interface TeamActionsProps {
    team: {
        id: string
        name: string
    }
    userRole: Role
}

export function TeamActions({ team, userRole }: TeamActionsProps) {
    const router = useRouter()
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    if (userRole === Role.MEMBER) return null

    const onDelete = async () => {
        setIsDeleting(true)
        try {
            await teamApi.deleteTeam(team.id)
            toast.success("Team deleted successfully")
            router.push("/")
            router.refresh()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete team")
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Team
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Team
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <TeamForm
                        initialData={team}
                        onSuccess={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Team</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{team.name}</span>?
                            This action cannot be undone and all data associated with this team will be permanently lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Team"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
