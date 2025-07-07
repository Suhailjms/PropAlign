'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the next best action to improve a proposal.
 *
 * - aiNextBestAction - A function that handles the process of suggesting the next best action.
 * - AINextBestActionInput - The input type for the aiNextBestAction function.
 * - AINextBestActionOutput - The return type for the aiNextBestAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AINextBestActionInputSchema = z.object({
  proposalContent: z
    .string()
    .describe('The current content of the proposal.'),
  proposalObjective: z
    .string()
    .describe('The main objective of the proposal.'),
  industry: z.string().describe('The industry of the proposal.'),
});
export type AINextBestActionInput = z.infer<typeof AINextBestActionInputSchema>;

const AINextBestActionOutputSchema = z.object({
  nextBestAction: z.string().describe('The AI-suggested next best action to improve the proposal.'),
  reasoning: z.string().describe('The reasoning behind the suggested action.'),
});
export type AINextBestActionOutput = z.infer<typeof AINextBestActionOutputSchema>;

export async function aiNextBestAction(input: AINextBestActionInput): Promise<AINextBestActionOutput> {
  return aiNextBestActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiNextBestActionPrompt',
  input: {schema: AINextBestActionInputSchema},
  output: {schema: AINextBestActionOutputSchema},
  prompt: `You are an AI assistant that analyzes proposals and suggests the next best action to improve their chances of success.

  Based on the current proposal content, objective, and industry, suggest a single, specific next best action.
  Also provide the reasoning behind the suggestion. The response should be concise and actionable.

  Proposal Content: {{{proposalContent}}}
  Proposal Objective: {{{proposalObjective}}}
  Industry: {{{industry}}}
  `,
});

const aiNextBestActionFlow = ai.defineFlow(
  {
    name: 'aiNextBestActionFlow',
    inputSchema: AINextBestActionInputSchema,
    outputSchema: AINextBestActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
