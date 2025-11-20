import { getInternationalTours, getNationalTours } from '@/actions/toursActions';
import TourOrderManager from '@/app/admin/_components/tour-order-manager';

export default async function TourOrderPage() {
  const nationalTours = await getNationalTours();
  const internationalTours = await getInternationalTours();

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