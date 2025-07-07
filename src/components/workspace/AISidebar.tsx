
"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, FileText, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Proposal } from "@/lib/types";

// AI Flow Imports
import { aiNextBestAction, type AINextBestActionOutput } from "@/ai/flows/ai-next-best-action";
import { aiSmartSummarizer, type AiSmartSummarizerOutput } from "@/ai/flows/ai-smart-summarizer";
import { aiComplianceCheck, type AIComplianceCheckOutput } from "@/ai/flows/ai-compliance-check";

interface AISidebarProps {
  proposal: Proposal;
  proposalContent: string;
}

export default function AISidebar({ proposal, proposalContent }: AISidebarProps) {
  const { toast } = useToast();

  const [nextActionLoading, setNextActionLoading] = useState(false);
  const [nextActionResult, setNextActionResult] = useState<AINextBestActionOutput | null>(null);
  
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<AiSmartSummarizerOutput | null>(null);

  const [complianceLoading, setComplianceLoading] = useState(false);
  const [complianceResult, setComplianceResult] = useState<AIComplianceCheckOutput | null>(null);

  const handleNextAction = async () => {
    setNextActionLoading(true);
    setNextActionResult(null);
    try {
      const res = await aiNextBestAction({
        proposalContent: proposalContent,
        proposalObjective: proposal.objective || '',
        industry: proposal.industry || '',
      });
      setNextActionResult(res);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Failed to get next best action." });
    }
    setNextActionLoading(false);
  };

  const handleSummarize = async () => {
    setSummaryLoading(true);
    setSummaryResult(null);
    try {
      const res = await aiSmartSummarizer({ content: proposalContent });
      setSummaryResult(res);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate summary." });
    }
    setSummaryLoading(false);
  };

  const handleComplianceCheck = async () => {
    setComplianceLoading(true);
    setComplianceResult(null);
    try {
      const res = await aiComplianceCheck({ proposalText: proposalContent });
      setComplianceResult(res);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Failed to perform compliance check." });
    }
    setComplianceLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Tools to enhance your proposal.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <span>Next Best Action</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
                <p className="text-xs text-muted-foreground">Get an AI-powered suggestion for what to do next.</p>
                <Button onClick={handleNextAction} disabled={nextActionLoading} className="w-full" size="sm">
                    {nextActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Suggest Action
                </Button>
                {nextActionLoading && <Skeleton className="h-10 w-full" />}
                {nextActionResult && (
                    <div className="text-xs space-y-1">
                        <p className="font-semibold text-primary">{nextActionResult.nextBestAction}</p>
                        <p className="text-muted-foreground">{nextActionResult.reasoning}</p>
                    </div>
                )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <span>Smart Summarizer</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
               <p className="text-xs text-muted-foreground">Generate a concise summary of your proposal content.</p>
                <Button onClick={handleSummarize} disabled={summaryLoading} className="w-full" size="sm">
                    {summaryLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Summary
                </Button>
                {summaryLoading && <Skeleton className="h-20 w-full" />}
                {summaryResult && (
                    <p className="text-xs text-muted-foreground">{summaryResult.summary}</p>
                )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
             <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>Compliance Check</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
                <p className="text-xs text-muted-foreground">Scan for missing legal terms or disclaimers.</p>
                <Button onClick={handleComplianceCheck} disabled={complianceLoading} className="w-full" size="sm">
                    {complianceLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check Compliance
                </Button>
                {complianceLoading && <Skeleton className="h-16 w-full" />}
                {complianceResult && (
                    <div className="text-xs space-y-2">
                        <p className={`font-semibold ${complianceResult.isCompliant ? 'text-green-600' : 'text-destructive'}`}>
                            {complianceResult.isCompliant ? "Check Passed" : "Issues Found"}
                        </p>
                        <p className="text-muted-foreground">{complianceResult.explanation}</p>
                        {!complianceResult.isCompliant && complianceResult.missingTerms.length > 0 && (
                            <div>
                                <h4 className="font-medium text-xs">Missing:</h4>
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {complianceResult.missingTerms.map((term, i) => <li key={i}>{term}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
