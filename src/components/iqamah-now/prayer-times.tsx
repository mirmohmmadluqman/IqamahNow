'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sunrise, Sun, Sunset, Moon, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parse } from 'date-fns';

type PrayerInfo = { adhan: string; iqamah: string; };
export type PrayerTimesType = {
  Fajr: PrayerInfo;
  Dhuhr: PrayerInfo;
  Asr: PrayerInfo;
  Maghrib: PrayerInfo;
  Isha: PrayerInfo;
  Sunrise: string;
  Imsak: string;
};

interface PrayerTimesProps {
  isRamadan: boolean;
  prayerTimes: PrayerTimesType | null;
}

const prayerIcons = {
  Fajr: <Moon className="h-6 w-6" />,
  Sunrise: <Sunrise className="h-6 w-6" />,
  Dhuhr: <Sun className="h-6 w-6" />,
  Asr: <Sun className="h-6 w-6" />,
  Maghrib: <Sunset className="h-6 w-6" />,
  Isha: <Moon className="h-6 w-6" />,
  Imsak: <UtensilsCrossed className="h-6 w-6" />,
  Iftar: <UtensilsCrossed className="h-6 w-6" />,
};

const Countdown = ({ targetTime, label }: { targetTime: string; label: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      // We parse the time string (e.g., "7:21 PM") into a Date object for today.
      const target = parse(targetTime, 'h:mm a', new Date());

      if (isNaN(target.getTime())) return;
      
      // If the target time has already passed today, set it for tomorrow.
      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Time is up!');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  if (!timeLeft) return null;

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-accent">{timeLeft}</p>
    </div>
  );
};

export default function PrayerTimes({ isRamadan, prayerTimes }: PrayerTimesProps) {
  const loading = !prayerTimes;

  const regularPrayers: (keyof PrayerTimesType)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const ramadanPrayers: (keyof PrayerTimesType | 'Iftar')[] = ['Imsak', ...regularPrayers.filter(p => p !== 'Sunrise'), 'Iftar'];
  
  // Use Maghrib adhan time for Iftar
  const prayerTimesWithIftar = prayerTimes ? { ...prayerTimes, Iftar: prayerTimes.Maghrib.adhan } : null;

  const prayersToShow = isRamadan ? ramadanPrayers : regularPrayers;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Today's Prayer Times</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className={cn("grid gap-4", "grid-cols-2 sm:grid-cols-3", isRamadan ? "lg:grid-cols-7" : "lg:grid-cols-6")}>
              {prayersToShow.map((prayer) => (
                <Card key={prayer} className="flex flex-col items-center justify-center p-4 text-center">
                  <Skeleton className="h-8 w-8 rounded-full mb-2" />
                  <Skeleton className="h-6 w-20 mb-1" />
                  <Skeleton className="h-6 w-24" />
                </Card>
              ))}
            </div>
        ) : (
          <>
            {isRamadan && prayerTimesWithIftar && prayerTimesWithIftar.Maghrib && prayerTimesWithIftar.Fajr && (
              <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-accent/10 p-4 md:grid-cols-2">
                <Countdown targetTime={prayerTimesWithIftar.Maghrib.adhan} label="Countdown to Iftar" />
                <Countdown targetTime={prayerTimesWithIftar.Fajr.adhan} label="Countdown to Suhoor ends (Fajr)" />
              </div>
            )}
            <div className={cn("grid gap-4", "grid-cols-2 sm:grid-cols-3", isRamadan ? "lg:grid-cols-7" : "lg:grid-cols-6")}>
              {prayerTimesWithIftar && prayersToShow.map((prayer) => {
                const prayerInfo = prayerTimesWithIftar[prayer as keyof typeof prayerTimesWithIftar];
                const isSingleTime = typeof prayerInfo === 'string';

                return (
                  <Card key={prayer} className="flex flex-col items-center justify-center p-3 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="mb-2 text-primary">
                      {prayerIcons[prayer as keyof typeof prayerIcons]}
                    </div>
                    <p className="font-semibold text-lg">{prayer}</p>
                    {isSingleTime ? (
                       <p className="text-muted-foreground text-xl font-mono">{prayerInfo}</p>
                    ) : (
                      <div className="text-center font-mono">
                        <p className="text-sm"><span className="font-sans text-muted-foreground text-xs">Adhan:</span> {prayerInfo.adhan}</p>
                        <p className="text-base font-bold"><span className="font-sans text-muted-foreground text-xs">Iqamah:</span> {prayerInfo.iqamah}</p>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
