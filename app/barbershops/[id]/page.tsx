import { db } from '@/app/_lib/prisma';
import BarbershopInfo from './_components/barbershop-info';

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  }
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {

  if (!params.id) {
    // TODO: Redirect to home page
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id
    }
  });

  if (!barbershop) {
    // TODO: Redirect to home page
    return null
  }

  return (
    <BarbershopInfo barbershop={barbershop} />
  );
}

export default BarbershopDetailsPage;