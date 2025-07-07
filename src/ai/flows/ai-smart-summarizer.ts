'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing proposal sections or entire documents.
 *
 * - aiSmartSummarizer - A function that takes proposal content and returns a summary.
 * - AiSmartSummarizerInput - The input type for the aiSmartSummarizer function.
 * - AiSmartSummarizerOutput - The return type for the aiSmartSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSmartSummarizerInputSchema = z.object({
  content: z
    .string()
    .describe('The proposal content to summarize.'),
});
export type AiSmartSummarizerInput = z.infer<typeof AiSmartSummarizerInputSchema>;

const AiSmartSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the proposal content.'),
});
export type AiSmartSummarizerOutput = z.infer<typeof AiSmartSummarizerOutputSchema>;

export async function aiSmartSummarizer(input: AiSmartSummarizerInput): Promise<AiSmartSummarizerOutput> {
  return aiSmartSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSmartSummarizerPrompt',
  input: {schema: AiSmartSummarizerInputSchema},
  output: {schema: AiSmartSummarizerOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing long proposal sections or entire documents.

  Given the following proposal content, provide a concise and informative summary that captures the key points.

  Content: {{{content}}}`,
});

const aiSmartSummarizerFlow = ai.defineFlow(
  {
    name: 'aiSmartSummarizerFlow',
    inputSchema: AiSmartSummarizerInputSchema,
    outputSchema: AiSmartSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
