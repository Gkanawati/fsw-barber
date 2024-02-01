import { format } from 'date-fns';
import Header from '../_components/header';
import { ptBR } from 'date-fns/locale';

export default function Home() {
  return (
    <>
      <Header />

      <div className='pt-5 px-5'>

        <h2 className='text-xl font-bold'>Olá, Miguel!</h2>
        <p className='capitalize text-sm'>{format(new Date(), "EEEE',' d 'de' MMMM", { locale: ptBR })}</p>
      </div>
    </>
  );
}
