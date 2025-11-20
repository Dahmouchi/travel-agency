import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscoverList } from "@/components/discover/discover-list";
import React from "react";
import {
  getInternationalDestinations,
  getNationalDestinations,
} from "@/actions/destinations";
import { getCategories } from "@/actions/categories";
import { getNatures } from "@/actions/natures";
import { getServices } from "@/actions/services";
import { getHotels } from "@/actions/hotelsActions";
import { DiscoverForm } from "@/components/discover/discover-form";
import { getAllToursDiscover, getAllToursDiscoverArchiver } from "@/actions/discover";

export default async function PageDiscover() {
  const nationalDestinations = await getNationalDestinations();
  const programs = await getAllToursDiscover();
  const programsArchi = await getAllToursDiscoverArchiver();
  const internationalDestinations = await getInternationalDestinations();
  const categories = await getCategories();
  const natures = await getNatures();
  const services = await getServices();
  const hotels = await getHotels();
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Morocco</h1>
        <p className="text-muted-foreground">
          Explore our amazing travel programs and experiences
        </p>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="programs">Discover Tours</TabsTrigger>
          <TabsTrigger value="add">Ajouter Tour</TabsTrigger>
           <TabsTrigger value="archiver">Tour Archivé</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="mt-6">
          <DiscoverList programs={programs.data} />
        </TabsContent>

        <TabsContent value="add">
          <DiscoverForm
            nationalDestinations={nationalDestinations}
            internationalDestinations={internationalDestinations}
            categories={categories}
            natures={natures}
            services={services}
            hotels={hotels}
          />
        </TabsContent>
        <TabsContent value="archiver">
         <DiscoverList programs={programsArchi.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
