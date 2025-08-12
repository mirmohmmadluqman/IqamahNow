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
