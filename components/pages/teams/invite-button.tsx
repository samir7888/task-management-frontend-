'use client';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { teamApi } from "@/service/api"
import { useParams } from "next/navigation";
import { InviteRole, Role } from "@/types/user-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LoadingButton } from "@/components/loading-button";
import { AxiosError } from "axios";

export const InviteButton = ({ userRole }: { userRole: Role }) => {
    const [open, setOpen] = useState(false);

    const params = useParams();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<InviteRole>(InviteRole.MEMBER);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const sendInvite = async () => {
        setIsLoading(true);
        try {
            await teamApi.inviteMember({ email, role }, params.teamid as string);
            toast.success('Invite email sent successfully')
            setOpen(false);
        } catch (error) {
            if(error instanceof AxiosError){
                toast.error(error.response?.data.message || 'Failed to send invite email')
                setError(error.response?.data.message || 'Failed to send invite email')


            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>Invite Member</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                        {userRole === Role.ADMIN && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select onValueChange={(value) => setRole(value as InviteRole)} defaultValue={role}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            Object.values(InviteRole).map((r) => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={sendInvite} disabled={!email || isLoading}>
                            {isLoading ? <LoadingButton loadingText="Inviting..." /> : "Invite"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}