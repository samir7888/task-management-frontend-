import { authApi, teamApi, todoApi } from "@/service/api";
import { Role, TUser } from "@/types/user-type";
import { TodoForm } from "@/components/pages/todos/todo-form";
import { InviteButton } from "@/components/pages/teams/invite-button";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TeamActions } from "@/components/pages/teams/team-actions";
import { TeamTodoList } from "@/components/pages/teams/team-todo-list";

interface Props {
    params: Promise<{
        teamid: string
    }>
}

export default async function SingleTeamPage({ params }: Props) {
    const { teamid } = await params;

    // Fetch user profile if needed
    const user: TUser = await authApi.getProfile();
    if (!user) {
        redirect('/login');
    }

    // Fetch team and todos
    const teamData = await teamApi.getTeam(teamid);
    const teamMembers= await teamApi.getTeamMembers(teamid);
    const teamMembersDetails = teamMembers.teamMembers;
    console.log(teamMembersDetails);
    console.log(teamMembers);
    const team = teamData?.team;
    const todosSnapshot = await todoApi.getTodos(teamid);

    // If team doesn't exist, redirect or show error
    if (!team) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-slate-800">Team not found</h1>
                <p className="text-slate-500 mt-2">The team you are looking for does not exist or you don't have access.</p>
                <Button className="mt-6" asChild>
                    <a href="/">Back to Dashboard</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                        <span className="text-white font-bold text-2xl uppercase">{team.name.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {team.name}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Team Dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user.role !== Role.MEMBER && <InviteButton userRole={user.role} />}
                    {user.role !== Role.MEMBER && <TeamActions team={team} userRole={user.role} />}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Side Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Overview</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800/50">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">Total Tasks</span>
                                <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                    {todosSnapshot?.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800/50">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">Total Members</span>
                                <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                    {teamMembersDetails?.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800/50">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">My Role</span>
                                <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold capitalize">
                                    {user.role.toLowerCase()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">Team ID</span>
                                <span className="text-slate-400 dark:text-slate-600 text-[10px] font-mono select-all">
                                    {teamid}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Todo List Section */}
                <div className="lg:col-span-2 space-y-8">
                    {user.role !== Role.MEMBER && (
                        <div className="transform transition-all">
                            <TodoForm teamId={teamid} />
                        </div>
                    )}

                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-1 rounded-2xl">
                        <div className="p-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Tasks</h2>
                            <span className="text-xs text-slate-400 font-medium">{todosSnapshot?.length || 0} total</span>
                        </div>
                        <div className="p-4 pt-0">
                            <TeamTodoList
                                todos={todosSnapshot || []}
                                userRole={user.role}
                                teamId={teamid}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}