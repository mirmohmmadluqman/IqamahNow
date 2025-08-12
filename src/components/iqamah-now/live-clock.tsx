'use client';

import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatGregorianDate = (dateToFormat: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateToFormat);
  };

  const formatTime = (dateToFormat: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(dateToFormat);
  };

  const formatHijriDate = (dateToFormat: Date) => {
    try {
       return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateToFormat);
    } catch (e) {
      // Fallback for environments that might not support the Islamic calendar well
      console.error("Could not format Hijri date:", e);
      return "Islamic date not available";
    }
   
  };

  return (
    <div className="hidden items-center justify-between text-xs text-muted-foreground md:flex flex-1 px-8">
      <div className="font-medium">{formatGregorianDate(date)}</div>
      <div className="text-xl font-bold text-foreground">{formatTime(date)}</div>
      <div className="font-medium" dir="rtl">{formatHijriDate(date)}</div>
    </div>
  );
}
