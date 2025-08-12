'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/iqamah-now/header';
import PrayerTimes, { PrayerTimesType } from '@/components/iqamah-now/prayer-times';
import MasjidFinder from '@/components/iqamah-now/masjid-finder';
import Announcements from '@/components/iqamah-now/announcements';
import NotificationCard from '@/components/iqamah-now/notification-card';

export default function Home() {
  const [isRamadan, setIsRamadan] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);

  useEffect(() => {
    // Check if it's Ramadan when the component mounts
    const checkRamadan = async () => {
      try {
        // Using a public API to check for Ramadan based on Hijri date
        // This checks for the 9th month of the Hijri calendar.
        const response = await fetch('https://api.aladhan.com/v1/gToH');
        const data = await response.json();
        if (data.code === 200 && data.data.hijri.month.number === 9) {
          setIsRamadan(true);
        } else {
          setIsRamadan(false);
        }
      } catch (error) {
        console.error("Could not check for Ramadan:", error);
        // Fallback to false if API fails
        setIsRamadan(false);
      }
    };
    checkRamadan();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header isRamadan={isRamadan} onRamadanToggle={setIsRamadan} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <PrayerTimes isRamadan={isRamadan} onPrayerTimesLoad={setPrayerTimes} />
          </div>
          <div className="grid gap-6 lg:col-span-2">
            <Announcements />
          </div>
          <div className="grid gap-6">
            <MasjidFinder />
            <NotificationCard prayerTimes={prayerTimes} isRamadan={isRamadan} />
          </div>
        </div>
      </main>
    </div>
  );
}
