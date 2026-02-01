"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { todoApi } from "@/service/api"
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { EllipsisVertical, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react"
import { toast } from "sonner"
import { TodoForm } from "../todos/todo-form"

interface Todo {
    id: string
    title: string
    completed: boolean
}

interface TeamTodoListProps {
    todos: Todo[]
    userRole: Role
    teamId: string
}

export function TeamTodoList({ todos, userRole, teamId }: TeamTodoListProps) {
    const router = useRouter()
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

    const onDelete = async (id: string) => {
        setIsDeletingId(id)
        try {
            await todoApi.deleteTodo(id)
            toast.success("Todo deleted successfully")
            router.refresh()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete todo")
        } finally {
            setIsDeletingId(null)
        }
    }

    const onToggleComplete = async (todo: Todo) => {
        try {
            await todoApi.updateTodo(todo.id, {
                title: todo.title,
                teamId: teamId,
                completed: !todo.completed
            } as any)
            router.refresh()
        } catch (error: any) {
            toast.error("Failed to update todo")
        }
    }

    if (!todos || todos.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 italic">No tasks found for this team yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <ul className="grid gap-3">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="group p-4 bg-white dark:bg-slate-900 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => onToggleComplete(todo)}
                                className="text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                {todo.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                            </button>
                            <span className={`text-slate-700 dark:text-slate-300 font-medium ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                                {todo.title}
                            </span>
                        </div>

                        {userRole !== Role.MEMBER && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EllipsisVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingTodo(todo)} className="cursor-pointer">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(todo.id)}
                                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                        disabled={isDeletingId === todo.id}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {isDeletingId === todo.id ? "Deleting..." : "Delete Task"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </li>
                ))}
            </ul>

            <Dialog open={!!editingTodo} onOpenChange={(open) => !open && setEditingTodo(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    {editingTodo && (
                        <TodoForm
                            teamId={teamId}
                            initialData={editingTodo}
                            onSuccess={() => setEditingTodo(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
