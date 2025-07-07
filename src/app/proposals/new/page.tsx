
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useActionState, type KeyboardEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiDraftProposal } from "@/ai/flows/ai-draft-proposal";
import { Loader2 } from "lucide-react";
import store from "@/lib/store";
import { createProposal, type CreateProposalState } from "@/lib/actions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

export default function NewProposalPage() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [draftContent, setDraftContent] = useState("");
    
    const initialState: CreateProposalState = { message: null, errors: {} };
    const [formState, formAction, isPending] = useActionState(createProposal, initialState);

    useEffect(() => {
        if (user && !['Admin', 'Approver', 'Manager', 'Editor'].includes(user.role)) {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You do not have permission to create proposals.",
            });
            router.push('/');
        }
    }, [user, router, toast]);

    useEffect(() => {
        const templateId = searchParams.get("templateId");
        if (templateId) {
            const template = store.getTemplates().find(t => t.id === templateId);
            if (template && template.content) {
                setDraftContent(template.content);
                toast({
                    title: "Template Applied",
                    description: `The "${template.title}" template has been applied to the draft.`,
                });
            }
        }
    }, [searchParams, toast]);
    
    const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).tagName !== 'TEXTAREA' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            if (isPending) {
                return;
            }
            event.currentTarget.requestSubmit();
        }
    };

    async function handleGenerateDraft(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const form = e.currentTarget.form;
        if (!form) return;
        
        const formData = new FormData(form);
        const clientNeeds = formData.get("clientNeeds") as string;
        const industry = formData.get("industry") as string;
        const solutionType = formData.get("solutionType") as string;
        const region = formData.get("region") as string;

        if(!clientNeeds || !industry || !solutionType || !region) {
            toast({
                variant: "destructive",
                title: "Missing fields for AI Draft",
                description: "Please fill in Client Needs, Industry, Solution Type, and Region to generate a draft.",
            });
            return;
        }

        setLoading(true);
        setDraftContent("");
        try {
            const result = await aiDraftProposal({
                clientNeeds,
                industry,
                solutionType,
                region,
            });
            setDraftContent(result.draftProposal);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error generating draft",
                description: "There was an error generating the AI draft. Please try again.",
            });
        }
        setLoading(false);
    }

    return (
        <main className="flex-1 p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Proposal</CardTitle>
                    <CardDescription>
                        Fill in the details below to create a new proposal. You can use the AI Assistant to generate a first draft.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} onKeyDown={handleKeyDown} className="space-y-6">
                        <input type="hidden" name="ownerEmail" value={user?.email} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Proposal Title <span className="text-destructive">*</span></Label>
                                <Input id="title" name="title" placeholder="e.g. Project Phoenix" required />
                                {formState.errors?.title && <p className="text-sm font-medium text-destructive">{formState.errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Client Name <span className="text-destructive">*</span></Label>
                                <Input id="clientName" name="clientName" placeholder="e.g. Innovate Corp" required />
                                {formState.errors?.clientName && <p className="text-sm font-medium text-destructive">{formState.errors.clientName}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="value">Proposal Value ($) <span className="text-destructive">*</span></Label>
                                <Input id="value" name="value" type="number" placeholder="e.g. 150000" required />
                                {formState.errors?.value && <p className="text-sm font-medium text-destructive">{formState.errors.value}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority <span className="text-destructive">*</span></Label>
                                <Select name="priority" defaultValue="Medium" required>
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select a priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formState.errors?.priority && <p className="text-sm font-medium text-destructive">{formState.errors.priority}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="industry">Industry <span className="text-destructive">*</span></Label>
                                <Input id="industry" name="industry" placeholder="e.g. Technology" required />
                                {formState.errors?.industry && <p className="text-sm font-medium text-destructive">{formState.errors.industry}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="solutionType">Solution Type <span className="text-destructive">*</span></Label>
                                <Input id="solutionType" name="solutionType" placeholder="e.g. Cloud Migration" required />
                                {formState.errors?.solutionType && <p className="text-sm font-medium text-destructive">{formState.errors.solutionType}</p>}
                            </div>
                             <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="region">Region <span className="text-destructive">*</span></Label>
                                <Input id="region" name="region" placeholder="e.g. North America" required />
                                {formState.errors?.region && <p className="text-sm font-medium text-destructive">{formState.errors.region}</p>}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="clientNeeds">Client Needs & Objectives <span className="text-destructive">*</span></Label>
                            <Textarea
                                id="clientNeeds"
                                name="clientNeeds"
                                placeholder="Describe the client's main goals and challenges..."
                                className="resize-y min-h-[100px]"
                                required
                            />
                            {formState.errors?.clientNeeds && <p className="text-sm font-medium text-destructive">{formState.errors.clientNeeds}</p>}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="button" variant="outline" onClick={handleGenerateDraft} disabled={loading || isPending}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Generating..." : "Generate Draft with AI"}
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? "Creating..." : "Create Proposal"}
                            </Button>
                        </div>

                         {draftContent && (
                             <div className="mt-8 pt-6 border-t">
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchParams.get("templateId") ? "Template Content" : "AI Generated Draft"}
                                </h3>
                                <Textarea
                                    id="draftContent"
                                    name="draftContent"
                                    value={draftContent}
                                    onChange={(e) => setDraftContent(e.target.value)}
                                    className="min-h-[200px] bg-muted"
                                />
                            </div>
                        )}
                        {formState.message && <p className="text-sm font-medium text-destructive mt-4">{formState.message}</p>}
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
