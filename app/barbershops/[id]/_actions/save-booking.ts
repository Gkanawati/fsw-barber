"use server";

import { db } from '@/app/_lib/prisma';
import { revalidatePath } from 'next/cache';

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

  // revalidatePath exclui o cache da página
  revalidatePath("/");
  revalidatePath("/bookings");
}