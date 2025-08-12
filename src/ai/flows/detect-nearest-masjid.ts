'use server';
/**
 * @fileOverview Automatically detects nearby masjids using GPS and the Google Places API.
 *
 * - detectNearestMasjid - A function that handles the masjid detection process.
 * - DetectNearestMasjidInput - The input type for the detectNearestMasjid function.
 * - DetectNearestMasjidOutput - The return type for the detectNearestMasjid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectNearestMasjidInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user.'),
  longitude: z.number().describe('The longitude of the user.'),
});
export type DetectNearestMasjidInput = z.infer<typeof DetectNearestMasjidInputSchema>;

const DetectNearestMasjidOutputSchema = z.object({
  masjidName: z.string().describe('The name of the nearest masjid.'),
  masjidAddress: z.string().describe('The address of the nearest masjid.'),
  masjidLocation: z.object({
    latitude: z.number().describe('The latitude of the nearest masjid.'),
    longitude: z.number().describe('The longitude of the nearest masjid.'),
  }).describe('The location of the nearest masjid.'),
});
export type DetectNearestMasjidOutput = z.infer<typeof DetectNearestMasjidOutputSchema>;

export async function detectNearestMasjid(input: DetectNearestMasjidInput): Promise<DetectNearestMasjidOutput> {
  return detectNearestMasjidFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectNearestMasjidPrompt',
  input: {schema: DetectNearestMasjidInputSchema},
  output: {schema: DetectNearestMasjidOutputSchema},
  prompt: `You are a helpful assistant that detects the nearest masjid to a user based on their location.

Given the user's latitude and longitude, find the nearest masjid and provide its name, address, and location (latitude and longitude).

Latitude: {{{latitude}}}
Longitude: {{{longitude}}}`,
});

const detectNearestMasjidFlow = ai.defineFlow(
  {
    name: 'detectNearestMasjidFlow',
    inputSchema: DetectNearestMasjidInputSchema,
    outputSchema: DetectNearestMasjidOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
