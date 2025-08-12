'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlarmClockCheck } from 'lucide-react';
import type { PrayerTimesType } from './prayer-times';
import { parse, isAfter, addDays } from 'date-fns';

interface NotificationCardProps {
    prayerTimes: PrayerTimesType | null;
    isRamadan: boolean;
}

const prayerOrder: (keyof Omit<PrayerTimesType, 'Sunrise' | 'Imsak'>)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const getNextPrayer = (prayerTimes: PrayerTimesType | null) => {
    if (!prayerTimes) return null;

    const now = new Date();

    for (const prayer of prayerOrder) {
        const prayerInfo = prayerTimes[prayer];
        if (typeof prayerInfo === 'string') continue; // Skip Sunrise/Imsak

        const iqamahTimeStr = prayerInfo.iqamah;
        if (!iqamahTimeStr) continue;
        
        // Parsing time like "4:28 AM"
        const iqamahTime = parse(iqamahTimeStr, 'h:mm a', new Date());

        if (isAfter(iqamahTime, now)) {
             return { name: prayer, time: iqamahTime };
        }
    }

    // If all prayers for today are done, the next prayer is Fajr tomorrow.
    const fajrInfo = prayerTimes.Fajr;
    if (fajrInfo && typeof fajrInfo !== 'string' && fajrInfo.iqamah) {
        const fajrIqamahTime = addDays(parse(fajrInfo.iqamah, 'h:mm a', new Date()), 1);
        return { name: 'Fajr', time: fajrIqamahTime };
    }
    
    return null;
}

const Countdown = ({ targetDate, prayerName }: { targetDate: Date; prayerName: string }) => {
    const calculateTimeLeft = () => {
        const difference = targetDate.getTime() - new Date().getTime();
        let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor(difference / (1000 * 60 * 60)),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return (
        <div className="text-center">
            <p className="text-muted-foreground">The prayer of {prayerName} is in</p>
            <div className="flex justify-center gap-4 mt-2">
                <div>
                    <div className="text-3xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
            </div>
        </div>
    );
};


export default function NotificationCard({ prayerTimes, isRamadan }: NotificationCardProps) {
    const [nextPrayerInfo, setNextPrayerInfo] = useState<{name: string, time: Date} | null>(null);

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
                        <span>Next Prayer Countdown</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4">
                        <div className='flex flex-col items-center w-full'>
                            <Skeleton className="h-8 w-32 mb-2" />
                            <div className="flex gap-4">
                               <Skeleton className="h-12 w-16" />
                               <Skeleton className="h-12 w-16" />
                               <Skeleton className="h-12 w-16" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
  return (
    <Card className="w-full bg-primary/10 border-primary/20">
       <CardHeader className='pb-2'>
        <CardTitle className="flex items-center gap-2 text-primary">
          <AlarmClockCheck className="h-6 w-6" />
          <span>Next Prayer Countdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Countdown targetDate={nextPrayerInfo.time} prayerName={nextPrayerInfo.name} />
      </CardContent>
    </Card>
  );
}
