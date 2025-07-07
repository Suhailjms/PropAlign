
"use client";

import { useEffect, useRef, useState, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { shareProposal, revokeProposalAccess, acceptInvite, type ShareProposalState } from "@/lib/actions";
import type { Proposal, AccessRole, Invitation } from "@/lib/types";
import { Mail, UserX, Loader2, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface ShareProposalDialogProps {
  children: React.ReactNode;
  proposal: Proposal;
  invitations: Invitation[];
}

export default function ShareProposalDialog({ children, proposal, invitations }: ShareProposalDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isRemoving, startRemoveTransition] = useTransition();
  const [isAccepting, startAcceptTransition] = useTransition();

  const { user } = useAuth();
  const currentUserRole: AccessRole = user?.role ?? 'Viewer';

  const initialState: ShareProposalState = { message: null, errors: {}, success: false };
  const [state, formAction, isPending] = useActionState(shareProposal, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Invite Sent",
          description: `(Simulation) ${state.message}`,
        });
        formRef.current?.reset();
        router.refresh(); 
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: state.message,
        });
      }
    }
  }, [state, toast, router]);

  const handleRemoveAccess = (email: string) => {
    startRemoveTransition(async () => {
        try {
            await revokeProposalAccess(proposal.id, email);
            toast({
                title: "Access Revoked",
                description: `Access for ${email} has been successfully revoked.`,
            });
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to revoke access: ${errorMessage}`,
            });
        }
    });
  };

  const handleAcceptInvite = (invitationId: string) => {
    startAcceptTransition(async () => {
        try {
            await acceptInvite(invitationId);
            toast({
                title: "Invitation Accepted",
                description: `Access has been granted. The user is now part of the team.`,
            });
            router.refresh();
        } catch (error)
        {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to accept invite: ${errorMessage}`,
            });
        }
    });
  };

  const canManage = currentUserRole === 'Admin';

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Share "{proposal.title}"</DialogTitle>
          <DialogDescription>
            Invite team members to collaborate. They will receive an email notification (simulated).
          </DialogDescription>
        </DialogHeader>
        {canManage ? (
            <form action={formAction} ref={formRef} className="space-y-4">
                <input type="hidden" name="proposalId" value={proposal.id} />
                <div className="grid grid-cols-3 items-center gap-4">
                    <div className="col-span-2">
                        <Label htmlFor="email" className="sr-only">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="person@example.com" required />
                    </div>
                    <Select name="role" defaultValue="Viewer" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Reviewer">Reviewer</SelectItem>
                            <SelectItem value="Approver">Approver</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    {isPending ? "Sending Invite..." : "Send Invite"}
                </Button>
            </form>
        ) : <p className="text-sm text-muted-foreground">You do not have permission to share this proposal.</p>}

        <div className="space-y-2 pt-4">
            <h4 className="text-sm font-medium">Shared with</h4>
            <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                {proposal.team.map(member => (
                    <div key={member.email} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <p className="text-sm text-muted-foreground">{member.role}</p>
                             {canManage && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isRemoving}>
                                            <UserX className="h-4 w-4" />
                                            <span className="sr-only">Remove access</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently revoke {member.email}'s access to this proposal. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleRemoveAccess(member.email)} disabled={isRemoving}>
                                                {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                Confirm
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {invitations.filter(inv => inv.status === 'pending').length > 0 && (
          <div className="space-y-2 pt-4 mt-4 border-t">
              <h4 className="text-sm font-medium">Pending Invitations</h4>
              <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                  {invitations.filter(inv => inv.status === 'pending').map(invite => (
                      <div key={invite.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                  <AvatarFallback><Mail className="h-4 w-4 text-muted-foreground" /></AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="text-sm font-medium">{invite.email}</p>
                                  <p className="text-xs text-muted-foreground">Invited as {invite.role}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAcceptInvite(invite.id)}
                                    disabled={isAccepting}
                                    title="Simulates the user clicking the invite link in their email"
                                >
                                    {isAccepting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                    Accept (Simulated)
                                </Button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
