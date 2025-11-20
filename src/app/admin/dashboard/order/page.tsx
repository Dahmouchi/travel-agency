import { getInternationalToursNonArchiver, getNationalToursNonArchiver } from '@/actions/toursActions';
import TourOrderManager from '../../_components/tour-order-manager';

export default async function TourOrderPage() {
  const nationalTours = await getNationalToursNonArchiver();
  const internationalTours = await getInternationalToursNonArchiver();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Gérer l&apos;ordre des Tours</h1>
      <TourOrderManager
        nationalTours={nationalTours} 
        internationalTours={internationalTours} 
      />
    </div>
  );
}