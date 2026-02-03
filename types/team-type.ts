export type TeamType = {
    id: string;
    name: string;
    created_at: string;
}

export type TeamResponseType = {
    message: string
    teams: TeamType[] | null;
}