
'use client';

import ProposalsList from "@/components/dashboard/ProposalsList";
import store from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ProposalsPage() {
  const proposals = store.getProposals();
  const { user } = useAuth();
  const canCreateProposal = user && ['Admin', 'Approver', 'Manager', 'Editor'].includes(user.role);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Proposals</h1>
            {canCreateProposal && (
              <Button asChild className="ml-auto">
                <Link href="/proposals/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Proposal
                </Link>
              </Button>
            )}
        </div>
      <ProposalsList 
        proposals={proposals}
        title="All Active Proposals"
        description="A list of all proposals currently in the pipeline."
      />
    </main>
  );
}
