"use client";

import { useState } from "react";
import { aiNextBestAction } from "@/ai/flows/ai-next-best-action";
import type { AINextBestActionOutput } from "@/ai/flows/ai-next-best-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { proposals } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

export default function NextBestAction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AINextBestActionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const sampleProposal = proposals[0];
      if (!sampleProposal) {
        throw new Error("No sample proposal found.");
      }
      const res = await aiNextBestAction({
        proposalContent: sampleProposal.content || '',
        proposalObjective: sampleProposal.objective || '',
        industry: sampleProposal.industry || '',
      });
      setResult(res);
    } catch (e) {
      setError("Failed to get next best action. Please try again.");
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          <span>AI: Next Best Action</span>
        </CardTitle>
        <CardDescription>
          Get an AI-powered suggestion for what to do next on a proposal.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[80px]">
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div>
            <h3 className="font-semibold text-primary">{result.nextBestAction}</h3>
            <p className="text-sm text-muted-foreground mt-1">{result.reasoning}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAction} disabled={loading} className="w-full">
          {loading ? "Analyzing..." : "Suggest Action for 'Project Phoenix'"}
        </Button>
      </CardFooter>
    </Card>
  );
}
