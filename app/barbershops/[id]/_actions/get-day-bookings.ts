"use server"

import { db } from '@/app/_lib/prisma';
import { endOfDay, startOfDay } from 'date-fns';

export async function getDayBookings(date: Date, barbershopId: string) {
  const bookings = await db.booking.findMany({
    where: {
      barbershopId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    }
  });

  return bookings;
}