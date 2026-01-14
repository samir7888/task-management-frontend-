'use client';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { teamApi } from "@/service/api"
import { useParams } from "next/navigation";
import { Role } from "@/types/user-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const InviteButton = ({ userRole }: { userRole: Role }) => {
    const [open, setOpen] = useState(false);

    const params = useParams();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>(Role.MEMBER);
    const sendInvite = async () => {
        await teamApi.inviteMember({ email, role }, params.teamid as string);
        toast.success('Invite email sent successfully')
        setOpen(false);
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
                        </div>
                        {userRole === Role.ADMIN && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select onValueChange={(value) => setRole(value as Role)} defaultValue={role}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            Object.values(Role).map((r) => (
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
                        <Button onClick={sendInvite} disabled={!email}>Invite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}