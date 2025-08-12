'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlarmClockCheck, ArrowRight } from 'lucide-react';
import type { PrayerTimesType } from './prayer-times';
import { parse, addMinutes, format, isAfter, addDays } from 'date-fns';

interface NotificationCardProps {
    prayerTimes: PrayerTimesType | null;
    isRamadan: boolean;
}

const prayerOrder: (keyof PrayerTimesType)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const getNextPrayer = (prayerTimes: PrayerTimesType | null) => {
    if (!prayerTimes) return null;

    const now = new Date();

    for (const prayer of prayerOrder) {
        const prayerTimeStr = prayerTimes[prayer];
        if (!prayerTimeStr) continue;
        
        // Parsing time like "5:30 PM"
        const prayerTime = parse(prayerTimeStr, 'h:mm a', new Date());

        if (isAfter(prayerTime, now)) {
             return { name: prayer, time: prayerTime };
        }
    }

    // If all prayers for today are done, the next prayer is Fajr tomorrow.
    if (prayerTimes.Fajr) {
        const fajrTime = addDays(parse(prayerTimes.Fajr, 'h:mm a', new Date()), 1);
        return { name: 'Fajr', time: fajrTime };
    }
    
    return null;
}


export default function NotificationCard({ prayerTimes, isRamadan }: NotificationCardProps) {
    const [nextPrayerInfo, setNextPrayerInfo] = useState<{name: string, time: Date} | null>(null);
    const [travelTime] = useState(15); // Assume 15 minutes travel time for now

    useEffect(() => {
        if(prayerTimes) {
             const updateNextPrayer = () => {
                setNextPrayerInfo(getNextPrayer(prayerTimes));
            };

            updateNextPrayer(); // Initial check
            const interval = setInterval(updateNextPrayer, 1000 * 60); // Update every minute

            return () => clearInterval(interval);
        }
    }, [prayerTimes]);


    if (!prayerTimes || !nextPrayerInfo) {
        return (
             <Card className="w-full bg-primary/10 border-primary/20">
                <CardHeader className='pb-2'>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <AlarmClockCheck className="h-6 w-6" />
                        <Skeleton className="h-6 w-32" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                             <Skeleton className="h-6 w-40 mb-1" />
                             <Skeleton className="h-4 w-48" />
                        </div>
                         <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    const leaveTime = addMinutes(nextPrayerInfo.time, -travelTime);

  return (
    <Card className="w-full bg-primary/10 border-primary/20">
      <CardHeader className='pb-2'>
        <CardTitle className="flex items-center gap-2 text-primary">
          <AlarmClockCheck className="h-6 w-6" />
          <span>Next Prayer: {nextPrayerInfo.name} at {format(nextPrayerInfo.time, 'h:mm a')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Leave at {format(leaveTime, 'h:mm a')}</p>
            <p className="text-sm text-muted-foreground">To arrive on time for Jama'ah.</p>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
