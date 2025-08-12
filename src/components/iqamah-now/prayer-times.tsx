'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sunrise, Sun, Sunset, Moon, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export type PrayerTimesType = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
};

interface PrayerTimesProps {
  isRamadan: boolean;
  onPrayerTimesLoad: (times: PrayerTimesType | null) => void;
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
      const target = new Date(targetTime);

      if (isNaN(target.getTime())) return;
      
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


export default function PrayerTimes({ isRamadan, onPrayerTimesLoad }: PrayerTimesProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = (latitude: number, longitude: number, timezone: string) => {
      const date = new Date();
      const formattedDate = format(date, 'dd-MM-yyyy');
      const url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Dubai&country=AE&method=4`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.code === 200) {
            const times = data.data.timings;
             const formatTime = (time: string) => {
              const parsedTime = parse(time, 'HH:mm', new Date());
              const zonedTime = toZonedTime(parsedTime, timezone);
              return format(zonedTime, 'h:mm a');
            };

            const formattedTimes = {
              Fajr: formatTime(times.Fajr),
              Sunrise: formatTime(times.Sunrise),
              Dhuhr: formatTime(times.Dhuhr),
              Asr: formatTime(times.Asr),
              Maghrib: formatTime(times.Maghrib),
              Isha: formatTime(times.Isha),
              Imsak: formatTime(times.Imsak),
            };
            setPrayerTimes(formattedTimes);
            onPrayerTimesLoad(formattedTimes);
          } else {
            setError('Could not fetch prayer times. Using sample data.');
          }
        })
        .catch(() => {
          setError('Could not fetch prayer times. Please check your connection.');
        })
        .finally(() => setLoading(false));
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude, timezone);
        },
        () => {
          // Fallback to a default location if geolocation fails
          setError('Location access denied. Fetching times for a default location.');
          fetchPrayerTimes(25.2048, 55.2708, timezone); // Dubai coordinates
        }
      );
    } else {
       setError('Geolocation not supported. Fetching times for a default location.');
       fetchPrayerTimes(25.2048, 55.2708, timezone); // Dubai coordinates
    }

  }, [onPrayerTimesLoad]);

  const regularPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const ramadanPrayers = ['Imsak', ...regularPrayers.filter(p => p !== 'Sunrise'), 'Iftar'];
  
  // Use Maghrib time for Iftar
  const prayerTimesWithIftar = prayerTimes ? { ...prayerTimes, Iftar: prayerTimes.Maghrib } : null;
  const prayersToShow = isRamadan ? ramadanPrayers : regularPrayers;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Today's Prayer Times</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
           <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
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
            {isRamadan && prayerTimesWithIftar && (
              <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-accent/10 p-4 md:grid-cols-2">
                <Countdown targetTime={prayerTimesWithIftar.Iftar} label="Countdown to Iftar" />
                <Countdown targetTime={prayerTimesWithIftar.Fajr} label="Countdown to Suhoor ends (Fajr)" />
              </div>
            )}
            <div className={cn("grid gap-4", "grid-cols-2 sm:grid-cols-3", isRamadan ? "lg:grid-cols-7" : "lg:grid-cols-6")}>
              {prayerTimesWithIftar && prayersToShow.map((prayer) => (
                <Card key={prayer} className="flex flex-col items-center justify-center p-4 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="mb-2 text-primary">
                    {prayerIcons[prayer as keyof typeof prayerIcons]}
                  </div>
                  <p className="font-semibold text-lg">{prayer}</p>
                  <p className="text-muted-foreground text-xl font-mono">{prayerTimesWithIftar[prayer as keyof typeof prayerTimesWithIftar]}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Add this type export
export type { PrayerTimesProps };
