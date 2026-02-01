import { authApi, teamApi } from "@/service/api";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/pages/teams/data-table";
import { columns } from "@/components/pages/teams/columns";
import { LogoutButton } from "@/components/auth/logout-button";
import { Role, TUser } from "@/types/user-type";
import { TeamType } from "@/types/team-type";
import { Users, LayoutDashboard, ShieldCheck, User as UserIcon, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateTeamDialog } from "@/components/pages/teams/create-team-dialog";

export default async function Home() {
  let user: TUser | null = null;
  let teams: any[] = [];
  let allTeams: any[] = [];

  user = await authApi.getProfile();
  if (!user) {
    return redirect('/login');
  }
  try {

    // Fetch teams where user is member
    const teamsData = await teamApi.getTeamsByMemberId(user.id);

    // Handle potential nesting from backend: [ { team: { ... } } ]   
    teams = teamsData.map((item: any) => item.team || item);


    allTeams = await teamApi.getTeams();

  } catch (error: any) {
    console.error("Home page data fetch error:", error);
    if (error.response?.status === 401) {
      return redirect('/login');
    }
  }

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200 gap-1 px-3 py-1">
          <ShieldCheck className="w-3 h-3" /> Admin
        </Badge>;
      case Role.LEAD:
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200 gap-1 px-3 py-1">
          <LayoutDashboard className="w-3 h-3" /> Team Lead
        </Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-200 gap-1 px-3 py-1">
          <UserIcon className="w-3 h-3" /> Member
        </Badge>;
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      {/* Elegant Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase">{user.name}</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Card */}
        <div className="relative mb-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -m-12 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, <span className="text-indigo-600 dark:text-indigo-400 capitalize">{user.name.split(' ')[0]}</span>!
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xl">
                Manage your teams and track progress across all your active projects from your personal dashboard.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[140px]">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Your Role</p>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 min-w-[140px]">
                <p className="text-xs font-semibold text-indigo-400 dark:text-indigo-500 uppercase tracking-wider mb-1">Total Teams</p>
                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{teams.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Your Teams</h2>
            </div>
            {user.role !== Role.MEMBER && <CreateTeamDialog />}
          </div>

          {teams.length > 0 ? (
            <div className="overflow-hidden">
              <div className="p-1">
                <DataTable columns={columns} data={teams} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-center">
              <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">You are not in any teams yet</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm px-6">
                Once you're added to a team or create your own, they will appear here in your dashboard.
              </p>
            </div>
          )}
        </div>


        {/* All Teams */}
        {(user.role === Role.ADMIN && allTeams.length > 0) &&
          (
            <div className=" space-y-12 mt-12 ">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">All Teams</h2>
              </div>
              <div className="p-1">
                <DataTable columns={columns} data={allTeams} />
              </div>
            </div>
          )}








      </div>
    </main>
  );
}
