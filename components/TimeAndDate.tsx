"use client";

import React, { useState, useEffect } from 'react';

export default function TimeAndDate() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date()); 
    const interval = setInterval(() => {
      setCurrentTime(new Date()); 
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentTime) return null;

  // Format time in 12h format
  let hours = currentTime.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(currentTime.getMinutes()).padStart(2, '0');
  const paddedSeconds = String(currentTime.getSeconds()).padStart(2, '0');

  // Format date
  const day = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const date = currentTime.getDate();
  const month = currentTime.toLocaleDateString('en-US', { month: 'long' });
  const year = currentTime.getFullYear();

  // suffix for date
  const suffix = (date: number): string => {
    if (date % 10 === 1 && date % 100 !== 11) return 'st';
    if (date % 10 === 2 && date % 100 !== 12) return 'nd';
    if (date % 10 === 3 && date % 100 !== 13) return 'rd';
    return 'th';
  };



  return (
    <>
      <div className="flex items-center gap-2 text-2xl lg:text-4xl xl:text-5xl font-semibold">
        <div className="hour">{paddedHours}</div>
        <span className="text-sm md:text-lg font-semibold">:</span>
        <div className="minute">{paddedMinutes}</div>
        <span className="text-sm md:text-lg font-semibold">:</span>
        <div className="second">{paddedSeconds}</div>
        <span>
          {amPm}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm lg:text-lg font-semibold">
        <div className="day">{day}</div>
        <div className="date">
          {date}
          {suffix(date)}
        </div>
        <div className="month">{month}</div>
        <div className="year">{year}</div>
      </div>
    </>
  );
}
