import { getDiscoverToursNonArchiver } from '@/actions/discover';
import TourOrderManagerDiscover from '@/app/admin/_components/tour-order-manager-discover';

export default async function TourOrderPage() {
  const nationalTours = await getDiscoverToursNonArchiver();

  return (
    <div className="space-y-8">
      <TourOrderManagerDiscover
        nationalTours={nationalTours} 
      />
    </div>
  );
}