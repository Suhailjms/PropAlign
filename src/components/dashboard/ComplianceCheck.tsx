"use client";

import { useState } from "react";
import { aiComplianceCheck } from "@/ai/flows/ai-compliance-check";
import type { AIComplianceCheckOutput } from "@/ai/flows/ai-compliance-check";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, BadgeCheck, XCircle } from "lucide-react";

const sampleProposalText = `This proposal outlines our solution to enhance your company's digital marketing presence. Our team will deliver a new website, manage social media channels, and run targeted ad campaigns.

Scope of Work:
- Website redesign
- SEO optimization
- Monthly content creation

Terms: Payment due within 30 days of invoice. This agreement is confidential.`;

export default function ComplianceCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIComplianceCheckOutput | null>(null);
  const [text, setText] = useState(sampleProposalText);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await aiComplianceCheck({ proposalText: text });
      setResult(res);
    } catch (e) {
      setError("Failed to perform compliance check. Please try again.");
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span>AI: Compliance Checklist</span>
        </CardTitle>
        <CardDescription>
          Scan proposal text for missing legal terms or security disclaimers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[220px]">
        <Textarea 
          placeholder="Paste proposal text here..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="text-xs"
        />
        {loading && (
          <div className="space-y-2 pt-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && <p className="text-sm text-destructive pt-4">{error}</p>}
        {result && (
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              {result.isCompliant ? (
                <BadgeCheck className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <h3 className={`font-semibold ${result.isCompliant ? 'text-green-600' : 'text-destructive'}`}>
                {result.isCompliant ? "Compliance Check Passed" : "Compliance Issues Found"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{result.explanation}</p>
            {!result.isCompliant && result.missingTerms.length > 0 && (
                <div>
                    <h4 className="font-medium text-sm">Missing Terms:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {result.missingTerms.map((term, i) => <li key={i}>{term}</li>)}
                    </ul>
                </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAction} disabled={loading || !text} className="w-full">
          {loading ? "Scanning..." : "Check Compliance"}
        </Button>
      </CardFooter>
    </Card>
  );
}
