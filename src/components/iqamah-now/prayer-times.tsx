'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sunrise, Sun, Sunset, Moon, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrayerTimesProps {
  isRamadan: boolean;
}

const prayerTimesData = {
  Fajr: '4:30 AM',
  Sunrise: '6:00 AM',
  Dhuhr: '12:30 PM',
  Asr: '4:00 PM',
  Maghrib: '6:55 PM',
  Isha: '8:30 PM',
  Imsak: '4:20 AM',
  Iftar: '6:55 PM',
};

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
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      const [time, modifier] = targetTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours < 12) {
        hours += 12;
      }
      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }

      target.setHours(hours, minutes, 0, 0);

      // If target time is in the past, assume it's for the next day
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

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-accent">{timeLeft}</p>
    </div>
  );
};

export default function PrayerTimes({ isRamadan }: PrayerTimesProps) {
  const regularPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const ramadanPrayers = ['Imsak', ...regularPrayers.filter(p => p !== 'Sunrise'), 'Iftar'];
  const prayersToShow = isRamadan ? ramadanPrayers : regularPrayers;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Today's Prayer Times</CardTitle>
      </CardHeader>
      <CardContent>
        {isRamadan && (
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-accent/10 p-4 md:grid-cols-2">
            <Countdown targetTime={prayerTimesData.Iftar} label="Countdown to Iftar" />
            <Countdown targetTime={prayerTimesData.Fajr} label="Countdown to Suhoor ends (Fajr)" />
          </div>
        )}
        <div className={cn("grid gap-4", "grid-cols-2 sm:grid-cols-3", isRamadan ? "lg:grid-cols-7" : "lg:grid-cols-6")}>
          {prayersToShow.map((prayer) => (
            <Card key={prayer} className="flex flex-col items-center justify-center p-4 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <div className="mb-2 text-primary">
                {prayerIcons[prayer as keyof typeof prayerIcons]}
              </div>
              <p className="font-semibold text-lg">{prayer}</p>
              <p className="text-muted-foreground text-xl font-mono">{prayerTimesData[prayer as keyof typeof prayerTimesData]}</p>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
