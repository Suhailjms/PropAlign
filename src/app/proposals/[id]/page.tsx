
import store from "@/lib/store";
import { notFound } from "next/navigation";
import ProposalWorkspace from "@/components/workspace/ProposalWorkspace";
import type { Invitation } from "@/lib/types";

export default async function ProposalWorkspacePage({ params }: { params: { id: string } }) {
    // In a real app, this would be an async database call.
    // The in-memory store is synchronous for this demo.
    const proposal = store.getProposalById(params.id);
    const invitations = store.getInvitationsForProposal(params.id);

    if (!proposal) {
        notFound();
    }

    return <ProposalWorkspace initialProposal={proposal} initialInvitations={invitations} />;
}
