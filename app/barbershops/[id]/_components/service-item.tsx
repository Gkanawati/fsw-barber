"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { toast } from "sonner"
import { signIn, useSession } from 'next-auth/react';
import { Barbershop, Booking, Service } from '@prisma/client';
import { Button } from '@/app/_components/ui/button';
import { Calendar } from '@/app/_components/ui/calendar';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/app/_components/ui/sheet';
import { ptBR, tr } from 'date-fns/locale';
import { generateDayTimeList } from '../_helpers/hours';
import { format, setHours, setMinutes } from 'date-fns';
import { saveBooking } from '../_actions/save-booking';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getDayBookings } from '../_actions/get-day-bookings';
import { BookingInfo } from '@/app/_components/booking-info';

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated?: boolean;
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {
  const router = useRouter();
  const { data } = useSession();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!date) {
      return;
    }

    async function refreshAvailableHours() {
      const availableBookings = await getDayBookings(date!, barbershop.id);
      setDayBookings(availableBookings);
    }
    refreshAvailableHours()
  }, [date, barbershop]);

  function handleDateClick(date: Date | undefined) {
    setDate(date);
    setHour(undefined);
  }

  function handleHourClick(hour: string) {
    setHour(hour);
  }

  function handleBooking() {
    if (!isAuthenticated) {
      return signIn("google");
    }

    // TODO: open modal agendamento
  }

  async function handleBookingSubmit() {
    setSubmitIsLoading(true);

    try {
      if (!date || !hour || !data?.user) {
        throw new Error('Selecione uma data e horário');
      }

      const dateHour = Number(hour.split(':')[0]);
      const dateMinutes = Number(hour.split(':')[1]);
      const hoursBooking = setHours(date, dateHour);
      const dateBooking = setMinutes(hoursBooking, dateMinutes);

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: dateBooking,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);
      toast("Reserva realizada com sucesso!", {
        description: format(dateBooking, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }),
        action: {
          label: "Visualizar",
          onClick: () => router.push('/bookings'),
        },
      });

      setHour(undefined);
      setDate(undefined);
    } catch (error) {
      console.error(error);
    }

    setSubmitIsLoading(false);
  }

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter(time => {
      // se houver alguma reserva em dayBookings com o mesmo horário, nao incluir

      const timeHour = Number(time.split(':')[0]);
      const timeMinutes = Number(time.split(':')[1]);

      const booking = dayBookings.find(booking => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

  return (
    <Card>
      <CardContent className='p-3'>
        <div className="flex gap-4 items-center">
          <div className='relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]'>
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-lg'
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className='font-bold'>{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }
                ).format(Number(service.price))}
              </p>

              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant='secondary' onClick={handleBooking}>Reservar</Button>
                </SheetTrigger>

                <SheetContent className='p-0'>
                  <SheetHeader className='text-left px-5 py-6 border-b border-solid border-secondary'>
                    <SheetTitle>
                      Fazer Reserva
                    </SheetTitle>
                  </SheetHeader>

                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    className="mt-3"
                    locale={ptBR}
                    fromDate={new Date()}
                    styles={{
                      head_cell: {
                        width: '100%',
                        textTransform: 'capitalize',
                      },
                      cell: {
                        width: '100%',
                      },
                      button: {
                        width: '100%',
                      },
                      nav_button_previous: {
                        width: '32px',
                        height: '32px',
                      },
                      nav_button_next: {
                        width: '32px',
                        height: '32px',
                      },
                      caption: {
                        textTransform: 'capitalize',
                      },
                    }}
                  />

                  {date && (
                    <div className="flex gap-3 py-6 px-5 border-y border-solid border-secondary
                    overflow-x-auto [&::-webkit-scrollbar]:hidden">
                      {timeList.length === 0 && (
                        <p className="text-center w-full text-sm text-gray-400">
                          Nenhum horário disponível
                        </p>
                      )}
                      {timeList.map((time) => (
                        <Button
                          key={time}
                          className='rounded-full'
                          onClick={() => handleHourClick(time)}
                          variant={hour === time ? 'default' : 'outline'}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <BookingInfo booking={{
                      barbershop: barbershop,
                      service: service,
                      date:
                        date && hour
                          ? setMinutes(setHours(date, Number(hour.split(':')[0])), Number(hour.split(':')[1]))
                          : undefined,
                    }} />
                  </div>

                  <SheetFooter className='px-5'>
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={(!date || !hour) || submitIsLoading}
                    >
                      {submitIsLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Carregando
                        </>
                      ) : (
                        <>
                          Confirmar Reserva
                        </>
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card >
  );
}

export default ServiceItem;