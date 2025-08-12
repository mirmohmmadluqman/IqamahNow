'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlarmClockCheck } from 'lucide-react';
import type { PrayerTimesType } from './prayer-times';
import { parse, isAfter, addDays, differenceInSeconds } from 'date-fns';

interface NotificationCardProps {
    prayerTimes: PrayerTimesType | null;
    isRamadan: boolean;
}

type PrayerEvent = {
    prayerName: string;
    type: 'Adhan' | 'Iqamah';
    time: Date;
};

const prayerOrder: (keyof Omit<PrayerTimesType, 'Sunrise' | 'Imsak'>)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const getNextPrayerEvent = (prayerTimes: PrayerTimesType | null): PrayerEvent | null => {
    if (!prayerTimes) return null;

    const now = new Date();
    const events: PrayerEvent[] = [];

    // Create a list of all Adhan and Iqamah events for today
    prayerOrder.forEach(prayerName => {
        const prayerInfo = prayerTimes[prayerName];
        if (typeof prayerInfo === 'object' && prayerInfo.adhan && prayerInfo.iqamah) {
            const adhanTime = parse(prayerInfo.adhan, 'h:mm a', new Date());
            const iqamahTime = parse(prayerInfo.iqamah, 'h:mm a', new Date());
            
            if (!isNaN(adhanTime.getTime())) {
                 events.push({ prayerName, type: 'Adhan', time: adhanTime });
            }
            if (!isNaN(iqamahTime.getTime())) {
                events.push({ prayerName, type: 'Iqamah', time: iqamahTime });
            }
        }
    });

    // Find the first event in the future
    const nextEvent = events.find(event => isAfter(event.time, now));

    if (nextEvent) {
        return nextEvent;
    }

    // If all events for today are past, the next event is Fajr Adhan tomorrow
    const fajrInfo = prayerTimes.Fajr;
    if (fajrInfo && typeof fajrInfo !== 'string' && fajrInfo.adhan) {
        const fajrAdhanTime = addDays(parse(fajrInfo.adhan, 'h:mm a', new Date()), 1);
        return { prayerName: 'Fajr', type: 'Adhan', time: fajrAdhanTime };
    }

    return null;
}

const Countdown = ({ targetDate, prayerName, eventType }: { targetDate: Date; prayerName: string; eventType: 'Adhan' | 'Iqamah' }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = differenceInSeconds(targetDate, new Date());
            let newTimeLeft = { hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    hours: Math.floor(difference / 3600),
                    minutes: Math.floor((difference % 3600) / 60),
                    seconds: Math.floor(difference % 60),
                };
            }
            setTimeLeft(newTimeLeft);
        };
        
        calculateTimeLeft(); // Initial calculation
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const label = eventType === 'Adhan' ? `The prayer of ${prayerName} is in` : `The iqamah of ${prayerName} is in`;

    return (
        <div className="text-center">
            <p className="text-muted-foreground">{label}</p>
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
    const [nextEvent, setNextEvent] = useState<PrayerEvent | null>(null);

    useEffect(() => {
        if(prayerTimes) {
             const updateNextPrayerEvent = () => {
                setNextEvent(getNextPrayerEvent(prayerTimes));
            };

            updateNextPrayerEvent(); // Initial check
            const interval = setInterval(updateNextPrayerEvent, 1000); // Check every second to switch smoothly

            return () => clearInterval(interval);
        }
    }, [prayerTimes]);


    if (!prayerTimes || !nextEvent) {
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
        <Countdown targetDate={nextEvent.time} prayerName={nextEvent.prayerName} eventType={nextEvent.type} />
      </CardContent>
    </Card>
  );
}
