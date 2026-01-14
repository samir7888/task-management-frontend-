"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { teamApi } from "@/service/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Save, Plus } from "lucide-react"

const teamSchema = z.object({
    name: z.string().min(2, "Team name must be at least 2 characters").max(50, "Team name must be less than 50 characters"),
})

type TeamFormValues = z.infer<typeof teamSchema>

interface TeamFormProps {
    initialData?: {
        id: string
        name: string
    }
    onSuccess?: () => void
}

export function TeamForm({ initialData, onSuccess }: TeamFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const isEditing = !!initialData

    const form = useForm<TeamFormValues>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: initialData?.name || "",
        },
    })

    async function onSubmit(values: TeamFormValues) {
        setIsLoading(true)
        try {
            if (isEditing) {
                await teamApi.updateTeam(initialData!.id, values)
                toast.success("Team updated successfully")
            } else {
                await teamApi.createTeam(values)
                toast.success("Team created successfully")
            }
            router.refresh()
            if (onSuccess) onSuccess()
        } catch (error: any) {
            console.error("Team form submission error:", error)
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
            <div className="mb-6 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isEditing ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
                    {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isEditing ? "Edit Team" : "Create New Team"}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isEditing ? "Update your team details below." : "Start by giving your team a name."}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">Team Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter team name (e.g. Design Ops)"
                                        disabled={isLoading}
                                        className="h-11 rounded-xl border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 bg-slate-50/50 dark:bg-slate-950/50"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    This is the name that will be displayed to all team members.
                                </FormDescription>
                                <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-11 rounded-xl font-bold transition-all ${isEditing
                            ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 shadow-amber-200 dark:shadow-none'
                            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 shadow-indigo-200 dark:shadow-none'
                            } shadow-lg text-white flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isEditing ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            <>
                                {isEditing ? "Save Changes" : "Create Team"}
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
