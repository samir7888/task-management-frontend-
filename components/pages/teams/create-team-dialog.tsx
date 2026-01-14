"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { TeamForm } from "./team-form"

export function CreateTeamDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
                    <Plus className="w-4 h-4" />
                    <span>New Team</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none">
                <TeamForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
