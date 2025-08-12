'use client';

import { useState } from 'react';
import Header from '@/components/iqamah-now/header';
import PrayerTimes, { PrayerTimesType } from '@/components/iqamah-now/prayer-times';
import MasjidFinder from '@/components/iqamah-now/masjid-finder';
import Announcements from '@/components/iqamah-now/announcements';
import NotificationCard from '@/components/iqamah-now/notification-card';

// Static prayer times provided by the user
const staticPrayerTimes: PrayerTimesType = {
  Fajr: { adhan: '4:18 AM', iqamah: '4:28 AM' },
  Dhuhr: { adhan: '12:36 PM', iqamah: '12:46 PM' },
  Asr: { adhan: '4:18 PM', iqamah: '4:28 PM' },
  Maghrib: { adhan: '7:21 PM', iqamah: '7:26 PM' },
  Isha: { adhan: '8:47 PM', iqamah: '8:57 PM' },
  Sunrise: '5:50 AM',
  Imsak: '4:08 AM', // 10 minutes before Fajr Adhan
};

export default function Home() {
  const [isRamadan, setIsRamadan] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header isRamadan={isRamadan} onRamadanToggle={setIsRamadan} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <PrayerTimes isRamadan={isRamadan} prayerTimes={staticPrayerTimes} />
          </div>
          <div className="grid gap-6 lg:col-span-2">
            <Announcements />
          </div>
          <div className="grid gap-6">
            <MasjidFinder />
            <NotificationCard prayerTimes={staticPrayerTimes} isRamadan={isRamadan} />
          </div>
        </div>
      </main>
    </div>
  );
}
