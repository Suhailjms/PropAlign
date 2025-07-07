// This file is machine-generated - edit with caution!

'use server';

/**
 * @fileOverview An AI-powered proposal drafting agent.
 *
 * - aiDraftProposal - A function that generates an initial draft of a proposal.
 * - AIDraftProposalInput - The input type for the aiDraftProposal function.
 * - AIDraftProposalOutput - The return type for the aiDraftProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDraftProposalInputSchema = z.object({
  clientNeeds: z
    .string()
    .describe('A brief description of the client’s needs and objectives.'),
  industry: z.string().describe('The industry of the client.'),
  solutionType: z.string().describe('The type of solution being proposed.'),
  region: z.string().describe('The region of the client.'),
});
export type AIDraftProposalInput = z.infer<typeof AIDraftProposalInputSchema>;

const AIDraftProposalOutputSchema = z.object({
  draftProposal: z.string().describe('The initial draft of the proposal.'),
});
export type AIDraftProposalOutput = z.infer<typeof AIDraftProposalOutputSchema>;

export async function aiDraftProposal(input: AIDraftProposalInput): Promise<AIDraftProposalOutput> {
  return aiDraftProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDraftProposalPrompt',
  input: {schema: AIDraftProposalInputSchema},
  output: {schema: AIDraftProposalOutputSchema},
  prompt: `You are an AI assistant helping proposal writers generate initial drafts of proposals.

  Based on the client's needs and objectives, industry, solution type, and region, generate an initial draft of a proposal.

  Client Needs: {{{clientNeeds}}}
  Industry: {{{industry}}}
  Solution Type: {{{solutionType}}}
  Region: {{{region}}}

  Draft Proposal:`,
});

const aiDraftProposalFlow = ai.defineFlow(
  {
    name: 'aiDraftProposalFlow',
    inputSchema: AIDraftProposalInputSchema,
    outputSchema: AIDraftProposalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
