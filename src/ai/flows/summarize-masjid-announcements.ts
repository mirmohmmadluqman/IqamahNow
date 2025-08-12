'use server';
/**
 * @fileOverview Summarizes masjid announcements using Genkit.
 *
 * - summarizeAnnouncement - A function that summarizes a given masjid announcement.
 * - SummarizeAnnouncementInput - The input type for the summarizeAnnouncement function.
 * - SummarizeAnnouncementOutput - The return type for the summarizeAnnouncement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAnnouncementInputSchema = z.object({
  announcementText: z
    .string()
    .describe('The text content of the masjid announcement to be summarized.'),
});
export type SummarizeAnnouncementInput = z.infer<typeof SummarizeAnnouncementInputSchema>;

const SummarizeAnnouncementOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the masjid announcement.'),
});
export type SummarizeAnnouncementOutput = z.infer<typeof SummarizeAnnouncementOutputSchema>;

export async function summarizeAnnouncement(input: SummarizeAnnouncementInput): Promise<SummarizeAnnouncementOutput> {
  return summarizeAnnouncementFlow(input);
}

const summarizeAnnouncementPrompt = ai.definePrompt({
  name: 'summarizeAnnouncementPrompt',
  input: {schema: SummarizeAnnouncementInputSchema},
  output: {schema: SummarizeAnnouncementOutputSchema},
  prompt: `Summarize the following masjid announcement in a concise and informative manner:\n\n{{{announcementText}}}`,
});

const summarizeAnnouncementFlow = ai.defineFlow(
  {
    name: 'summarizeAnnouncementFlow',
    inputSchema: SummarizeAnnouncementInputSchema,
    outputSchema: SummarizeAnnouncementOutputSchema,
  },
  async input => {
    const {output} = await summarizeAnnouncementPrompt(input);
    return output!;
  }
);
