"use server";

import { db } from '@/app/_lib/prisma';

interface saveBookingParams {
  barbershopId: string;
  serviceId: string;
  userId: string;
  date: Date;
}

export async function saveBooking(params : saveBookingParams) {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
      barbershopId: params.barbershopId
    }
  })
}