'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlarmClockCheck, ArrowRight } from 'lucide-react';

export default function NotificationCard() {
  return (
    <Card className="w-full bg-primary/10 border-primary/20">
      <CardHeader className='pb-2'>
        <CardTitle className="flex items-center gap-2 text-primary">
          <AlarmClockCheck className="h-6 w-6" />
          <span>Next Prayer: Dhuhr</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Leave at 12:15 PM</p>
            <p className="text-sm text-muted-foreground">To arrive on time for Jama'ah.</p>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
