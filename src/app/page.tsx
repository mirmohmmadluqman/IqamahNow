'use client';

import { useState } from 'react';
import Header from '@/components/iqamah-now/header';
import PrayerTimes, { PrayerTimesType } from '@/components/iqamah-now/prayer-times';
import MasjidFinder from '@/components/iqamah-now/masjid-finder';
import Announcements from '@/components/iqamah-now/announcements';
import NotificationCard from '@/components/iqamah-now/notification-card';

// Static prayer times for Masjid Salafiya Diyarwani New-Colony Batamaloo
const staticPrayerTimes: PrayerTimesType = {
  Fajr: { adhan: '5:03 AM', iqamah: '5:13 AM' },
  Dhuhr: { adhan: '12:20 PM', iqamah: '12:30 PM' },
  Asr: { adhan: '3:41 PM', iqamah: '3:51 PM' },
  Maghrib: { adhan: '6:14 PM', iqamah: '6:19 PM' },
  Isha: { adhan: '7:32 PM', iqamah: '7:42 PM' },
  Jumuah: { adhan: '12:20 PM', iqamah: '12:30 PM' },
  Sunrise: '6:26 AM',
  Imsak: '4:53 AM', // 10 minutes before Fajr Adhan
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
