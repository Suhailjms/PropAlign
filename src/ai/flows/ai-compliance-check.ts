// This is an auto-generated file from Firebase Studio.
'use server';
/**
 * @fileOverview AI compliance check flow.
 *
 * - aiComplianceCheck - A function that scans the proposal for missing legal terms or security disclaimers.
 * - AIComplianceCheckInput - The input type for the aiComplianceCheck function.
 * - AIComplianceCheckOutput - The return type for the aiComplianceCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIComplianceCheckInputSchema = z.object({
  proposalText: z.string().describe('The text of the proposal to check for compliance.'),
});
export type AIComplianceCheckInput = z.infer<typeof AIComplianceCheckInputSchema>;

const AIComplianceCheckOutputSchema = z.object({
  missingTerms: z.array(z.string()).describe('A list of missing legal terms or security disclaimers.'),
  isCompliant: z.boolean().describe('Whether the proposal is compliant with legal terms and security disclaimers.'),
  explanation: z.string().describe('An explanation of the compliance check results.'),
});
export type AIComplianceCheckOutput = z.infer<typeof AIComplianceCheckOutputSchema>;

export async function aiComplianceCheck(input: AIComplianceCheckInput): Promise<AIComplianceCheckOutput> {
  return aiComplianceCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiComplianceCheckPrompt',
  input: {schema: AIComplianceCheckInputSchema},
  output: {schema: AIComplianceCheckOutputSchema},
  prompt: `You are an automated compliance checking service. Your only output format is a single, valid JSON object that adheres strictly to the provided schema. Do not include any other text, explanations, or markdown formatting like \`\`\`json.

Your task is to analyze the provided proposal text for the presence of standard legal and security clauses.

Here is the checklist of clauses to look for:
- Confidentiality Clause
- Limitation of Liability
- Data Protection / GDPR compliance statement
- Term and Termination Clause
- Intellectual Property Rights

Proposal Text:
"""
{{{proposalText}}}
"""

Based on your analysis, populate the JSON fields:
- "isCompliant": Set to 'true' if ALL clauses from the checklist are present. Otherwise, set to 'false'.
- "missingTerms": An array of strings containing the names of the specific clauses from the checklist that are missing. If the proposal is compliant, this MUST be an empty array [].
- "explanation": A brief, one-sentence summary of your findings. For example: "The proposal is missing clauses for Limitation of Liability and Intellectual Property." or "The proposal appears to contain all necessary standard legal clauses."

Your response must be ONLY the JSON object.`,
});

const aiComplianceCheckFlow = ai.defineFlow(
  {
    name: 'aiComplianceCheckFlow',
    inputSchema: AIComplianceCheckInputSchema,
    outputSchema: AIComplianceCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI model did not return a valid output.');
    }
    return output;
  }
);
