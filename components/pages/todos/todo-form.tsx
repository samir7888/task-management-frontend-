"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { todoApi } from "@/service/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, ListTodo, Plus, CheckCircle2 } from "lucide-react"
import { LoadingButton } from "@/components/loading-button"
import { useAppMutation } from "@/hooks/useAppMutation"

const todoSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    teamId: z.string(),
})

type TodoFormValues = z.infer<typeof todoSchema>

interface TodoFormProps {
    teamId: string
    initialData?: {
        id: string
        title: string
    }
    onSuccess?: () => void
}

export function TodoForm({ teamId, initialData, onSuccess }: TodoFormProps) {

    const isEditing = !!initialData
    const form = useForm<TodoFormValues>({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            title: initialData?.title || "",
            teamId: teamId,
        },
    })

    const { mutateAsync: createTodo, isPending: isCreatingTodo } = useAppMutation();
    async function onSubmit(values: TodoFormValues) {
        const valueWithId = { ...values, teamId }

        try {
            if (isEditing) {
                await createTodo({
                    endpoint: `todo/${initialData!.id}`,
                    method: 'patch',
                    data: valueWithId,
                    invalidateTags: ['todos', teamId]
                })
            } else {
                await createTodo({
                    endpoint: 'todo',
                    method: 'post',
                    data: valueWithId,
                    invalidateTags: ['todos', teamId]

                })
                form.reset({ title: "", teamId }) // Reset title after successful creation
            }
            if (onSuccess) onSuccess()
        } catch (error: any) {
            console.error("Todo form submission error:", error)
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
        }
    }

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${isEditing ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                    {isEditing ? <CheckCircle2 className="w-5 h-5" /> : <ListTodo className="w-5 h-5" />}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {isEditing ? "Edit Task" : "Add New Task"}
                </h3>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Task Title</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <Input
                                            placeholder="What needs to be done?"
                                            disabled={isCreatingTodo}
                                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 bg-slate-50/50 dark:bg-slate-950/50 pr-24 transition-all"
                                            {...field}
                                        />
                                        <div className="absolute right-1 top-1 bottom-1">
                                            <Button
                                                type="submit"
                                                disabled={isCreatingTodo || !field.value}
                                                size="sm"
                                                className={`h-full rounded-lg px-4 font-bold transition-all ${isEditing
                                                    ? 'bg-emerald-600 hover:bg-emerald-700'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                    } text-white flex items-center gap-2`}
                                            >
                                                {isCreatingTodo ? (
                                                    <LoadingButton loadingText="Adding..." />
                                                ) : (
                                                    <>
                                                        {isEditing ? "Save" : "Add"}
                                                        {!isEditing && <Plus className="w-4 h-4" />}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs mt-1" />
                            </FormItem>
                        )}
                    />
                    <input type="hidden" {...form.register("teamId")} />
                </form>
            </Form>
        </div>
    )
}
