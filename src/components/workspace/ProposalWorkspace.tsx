
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save, Share2, MessageSquare, History, Send, CheckCircle, Loader2, ThumbsUp, XCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AISidebar from "@/components/workspace/AISidebar";
import { useToast } from "@/hooks/use-toast";
import { updateProposalStatus } from "@/lib/actions";
import type { Proposal, ProposalStatus, AccessRole, Invitation } from "@/lib/types";
import ShareProposalDialog from "@/components/workspace/ShareProposalDialog";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SaveStatus = 'unsaved' | 'saving' | 'saved';

export default function ProposalWorkspace({ initialProposal, initialInvitations }: { initialProposal: Proposal, initialInvitations: Invitation[] }) {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    
    const [proposal, setProposal] = useState<Proposal>(initialProposal);
    const [content, setContent] = useState(initialProposal.content || '');
    const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [isUpdating, setIsUpdating] = useState(false);

    const currentUserRole: AccessRole = user?.role ?? 'Viewer';

    // Permissions
    const isSubmitter = user?.email === proposal.submittedBy;
    const hasApprovalRole = ['Manager', 'Approver'].includes(currentUserRole);

    const canEdit = (proposal.status === 'Draft' || proposal.status === 'In Revision') && ['Admin', 'Approver', 'Manager', 'Editor'].includes(currentUserRole);
    const canSubmitForReview = ['Admin', 'Manager', 'Editor'].includes(currentUserRole);
    const canRequestRevision = hasApprovalRole && !isSubmitter;
    const canApprove = hasApprovalRole && !isSubmitter;
    const canMarkAsSubmitted = ['Admin', 'Manager', 'Editor'].includes(currentUserRole);
    const canShare = currentUserRole === 'Admin';
    const canUseAI = currentUserRole !== 'Viewer';

    // Effect to sync state if props change (e.g., after router.refresh)
    useEffect(() => {
        setProposal(initialProposal);
        setContent(initialProposal.content || '');
        setInvitations(initialInvitations);
        setIsUpdating(false);
    }, [initialProposal, initialInvitations]);
    
    // Effect for autosave simulation
    useEffect(() => {
        if (saveStatus === 'unsaved') {
            const timer = setTimeout(() => {
                setSaveStatus('saving');
                // In a real app, this would be a server action to save content
                setTimeout(() => {
                    setSaveStatus('saved');
                }, 1500);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [content, saveStatus]);
    
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSaveStatus('unsaved');
        setContent(e.target.value);
    };

    const handleStatusChange = async (newStatus: ProposalStatus) => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'You must be logged in to perform this action.',
            });
            return;
        }
        setIsUpdating(true);
        try {
            await updateProposalStatus(proposal.id, newStatus, user.email);
            toast({
                title: "Status Updated",
                description: `Proposal moved to "${newStatus}".`,
            });
            // router.refresh() will refetch data on the server and re-render the page
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: 'destructive',
                title: 'Error',
                description: errorMessage,
            });
            setIsUpdating(false);
        }
    };

    const SaveStatusIndicator = () => {
        switch (saveStatus) {
            case 'saving':
                return <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</div>;
            case 'saved':
                return <div className="flex items-center text-sm text-muted-foreground"><CheckCircle className="mr-2 h-4 w-4 text-green-500" />Saved</div>;
            case 'unsaved':
                 return <div className="flex items-center text-sm text-muted-foreground"><Save className="mr-2 h-4 w-4" />Unsaved changes</div>;
            default:
                return null;
        }
    };

    return (
        <main className="flex-1 p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                     <Badge 
                                        variant="outline" 
                                        className={
                                            `mb-2 ${
                                            proposal.status === 'In Review' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                                            proposal.status === 'In Revision' ? 'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400' :
                                            proposal.status === 'Approved' ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400' :
                                            proposal.status === 'Submitted' ? 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                                            ''
                                            }`
                                        }>
                                        {proposal.status}
                                    </Badge>
                                    <CardTitle className="text-2xl font-bold font-headline">{proposal.title}</CardTitle>
                                    <CardDescription>Client: {proposal.client}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {canEdit && <SaveStatusIndicator />}
                                    <Button variant="outline" size="icon" title="History" onClick={() => toast({ title: "Coming Soon!", description: "Proposal history feature will be available shortly." })}><History className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" title="Comments" onClick={() => toast({ title: "Coming Soon!", description: "Inline comments feature will be available shortly." })}><MessageSquare className="h-4 w-4" /></Button>
                                    
                                    {canShare && (
                                        <ShareProposalDialog proposal={proposal} invitations={invitations}>
                                            <Button variant="outline"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
                                        </ShareProposalDialog>
                                    )}

                                    {isSubmitter && hasApprovalRole && (proposal.status === 'In Review' || proposal.status === 'Submitted') && (
                                        <Alert variant="default" className="p-3 text-xs bg-secondary">
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                You submitted this proposal. Another approver must review it.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    
                                    {(proposal.status === 'Draft' || proposal.status === 'In Revision') && canSubmitForReview && (
                                        <Button onClick={() => handleStatusChange('In Review')} disabled={isUpdating}>
                                            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                                            Submit for Review
                                        </Button>
                                    )}

                                    {(proposal.status === 'In Review' || proposal.status === 'Submitted') && (
                                        <>
                                            {canRequestRevision && (
                                                <Button variant="outline" onClick={() => handleStatusChange('In Revision')} disabled={isUpdating}>
                                                    {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                                                    Reject
                                                </Button>
                                            )}
                                            {canApprove && (
                                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange('Approved')} disabled={isUpdating}>
                                                    {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ThumbsUp className="h-4 w-4 mr-2" />}
                                                    Approve
                                                </Button>
                                            )}
                                        </>
                                    )}

                                    {proposal.status === 'Approved' && canMarkAsSubmitted && (
                                        <Button onClick={() => handleStatusChange('Submitted')} disabled={isUpdating}>
                                            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                                            Mark as Submitted
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={content}
                                onChange={handleContentChange}
                                className="min-h-[65vh] text-base"
                                placeholder="Start writing your proposal..."
                                disabled={!canEdit}
                            />
                        </CardContent>
                    </Card>
                </div>

                <aside className="w-full lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Proposal Outline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <a href="#" className="block p-2 rounded-md hover:bg-muted font-medium text-primary bg-muted">Executive Summary</a>
                            <a href="#" className="block p-2 rounded-md hover:bg-muted">Objectives</a>
                            <a href="#" className="block p-2 rounded-md hover:bg-muted">Scope of Work</a>
                            <a href="#" className="block p-2 rounded-md hover:bg-muted">Solution Details</a>
                            <a href="#" className="block p-2 rounded-md hover:bg-muted">Pricing</a>
                            <a href="#" className="block p-2 rounded-md hover:bg-muted">Timeline</a>
                            <a href="#" className="block p-2 rounded-md hover:bg-muted">ROI Analysis</a>
                        </CardContent>
                    </Card>
                    {canUseAI ? (
                        <AISidebar proposal={proposal} proposalContent={content} />
                    ) : (
                         <Card>
                            <CardHeader>
                                <CardTitle>AI Assistant</CardTitle>
                                <CardDescription>Tools to enhance your proposal.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground p-4 text-center">AI features are not available for your current role.</p>
                            </CardContent>
                        </Card>
                    )}
                </aside>
            </div>
        </main>
    );
}
