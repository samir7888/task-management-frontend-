import { authApi, teamApi, todoApi } from "@/service/api";
import { Role, TUser } from "@/types/user-type";
import { TodoForm } from "@/components/pages/todos/todo-form";
import { InviteButton } from "@/components/pages/teams/invite-button";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        teamid: string
    }>
}

export default async function SingleTeamPage({ params }: Props) {

   
    const { teamid } = await params;

    // Fetch user profile if needed (now works on both server and client!)
    const user: TUser = await authApi.getProfile();
    if(!user) {
        redirect('/login');
    }

    // Fetch team and todos
    const team = await teamApi.getTeam(teamid);
    const todos = await todoApi.getTodos(teamid);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Team: {team?.team?.name || 'Loading...'}</h1>

            <div className="grid gap-6">
                <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-8 rounded-2xl transition-all hover:shadow-2xl">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4 justify-between">

                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xl">{team?.name?.charAt(0) || 'T'}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Overview</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Team ID: {teamid}</p>
                        </div>
                        </div>
                        { user.role !== Role.MEMBER && <InviteButton userRole={user.role} />}
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">Total Todos</span>
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                                {todos?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Todo List Section */}
                <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Todos</h2>
                    </div>

                    {user.role !== Role.MEMBER && (
                        <div className="mb-8">
                            <TodoForm teamId={teamid} />
                        </div>
                    )}

                    {todos && todos.length > 0 ? (
                        <ul className="space-y-3">
                            {todos.map((todo: any) => (
                                <li key={todo.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                                    <span className="text-slate-700 dark:text-slate-300 tracking-tight">{todo.title}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-10 text-slate-400 italic">
                            No todos found for this team yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}