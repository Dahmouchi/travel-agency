import React from "react";
import { getTourById } from "@/actions/toursActions";
import { getInternationalDestinations, getNationalDestinations } from "@/actions/destinations";
import { getCategories } from "@/actions/categories";
import { getNatures } from "@/actions/natures";
import { getServices } from "@/actions/services";
import { UpdateTourFormDiscover } from "@/components/discover/update-tour-form-discover";
//import { getHotels } from "@/actions/hotelsActions";

export default async function UpdateTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ⚠️ Await params before destructuring
  const { id } = await params;
  const result = await getTourById(id);
  const nationalDestinations = await getNationalDestinations();
  const internationalDestinations = await getInternationalDestinations();
  const categories = await getCategories();
  const natures = await getNatures();
  const services = await getServices();
  if (!result.success) {
    return <div>Tour non trouvé</div>;
  }

  const tour = result.data;

  if (!tour) {
    return <div>Tour non trouvé</div>;
  }

  return (
    <div>
      <UpdateTourFormDiscover initialData={tour} nationalDestinations={nationalDestinations} internationalDestinations={internationalDestinations} categories={categories} natures={natures} services={services}  tourId={id} ></UpdateTourFormDiscover>
    </div>
  );
}