'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { summarizeAnnouncement } from '@/ai/flows/summarize-masjid-announcements';
import { Megaphone, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const sampleAnnouncement =
  'As-salamu alaykum. We are pleased to announce a special lecture series on the Seerah of the Prophet (PBUH) every Friday after Isha prayer, starting this week. The series will be conducted by Sheikh Abdullah. All are encouraged to attend with their families. Additionally, there will be a community potluck dinner this Saturday after Maghrib. Please sign up on the sheet in the lobby if you plan to bring a dish. JazakAllah Khair.';

export default function Announcements() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setLoading(true);
    setSummary('');
    try {
      const result = await summarizeAnnouncement({ announcementText: sampleAnnouncement });
      setSummary(result.summary);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'The AI could not summarize the announcement. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          <span>Masjid Announcements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className='text-left font-semibold'>
              Community Update & Lecture Series
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-muted-foreground">{sampleAnnouncement}</p>
              
              <Button onClick={handleSummarize} disabled={loading}>
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Bot className="mr-2 h-4 w-4" />
                )}
                {loading ? 'Summarizing...' : 'Summarize with AI'}
              </Button>

              {summary && (
                <div className="mt-4 rounded-lg border bg-accent/10 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-accent">
                    <Bot className="h-5 w-5" />
                    AI Summary
                  </h4>
                  <p className="mt-2 text-sm text-accent-foreground/90">{summary}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
