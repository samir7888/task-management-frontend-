import { DataTable } from "@/components/pages/teams/data-table"
import { columns } from "@/components/pages/teams/columns"
import { TeamType } from "@/types/team-type"
import { authApi, teamApi } from "@/service/api"

async function getData(): Promise<TeamType[]> {
    const user = await authApi.getProfile();
    const teamsData = await teamApi.getTeamsByMemberId(user.id);
    // Map to flat objects if nested
    return teamsData.map((item: any) => item.team || item);
}

export default async function DemoPage() {
    const teams = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={teams} />
        </div>
    )
}