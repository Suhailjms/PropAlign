import ProposalOutcomeChart from "@/components/dashboard/ProposalOutcomeChart";
import TurnaroundTimeChart from "@/components/dashboard/TurnaroundTimeChart";
import TemplateUsageChart from "@/components/dashboard/TemplateUsageChart";
import ProposalFunnelChart from "@/components/dashboard/ProposalFunnelChart";
import ProposalsList from "@/components/dashboard/ProposalsList";
import NextBestAction from "@/components/dashboard/NextBestAction";
import ComplianceCheck from "@/components/dashboard/ComplianceCheck";
import store from "@/lib/store";

export default function Home() {
  const proposals = store.getProposals();
  const templates = store.getTemplates();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <ProposalFunnelChart proposals={proposals} />
        </div>
        <ProposalOutcomeChart proposals={proposals} />
        <TurnaroundTimeChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <NextBestAction />
        <ComplianceCheck />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
         <TemplateUsageChart templates={templates} />
         <ProposalsList proposals={proposals} />
      </div>
    </main>
  );
}
