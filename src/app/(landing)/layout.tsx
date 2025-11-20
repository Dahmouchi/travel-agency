import { Category, Destination, Landing, Nature } from "@prisma/client";
import Footer from "./_components/Footer";
import { Navbar } from "./_components/Header";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const sections: Landing | null = await prisma.landing.findFirst({});
  const destinationNational: Destination[] | null = await prisma.destination.findMany({
      where: {
        type:"NATIONAL",
      },
    });
    const category: Category[] | null = await prisma.category.findMany({});
    const nature: Nature[] | null = await prisma.nature.findMany({});
    const destinationInternational: Destination[] | null = await prisma.destination.findMany({
      where: {
        type:"INTERNATIONAL",
      },
    });
     const navbarItem = await prisma.navbarItem.findMany({
    orderBy: { order: "asc" },
  });
  return (
    <div className="">
       {(sections?.navbar ?? true) && <Navbar nationalDestinations={destinationNational} internationalDestinations={destinationInternational} voyage={category} nature={nature} navbarItems={navbarItem}/>}
      
      {children}
       {(sections?.footer ?? true) && <Footer voyage={destinationNational} nature={nature}/>}
      
    </div>
  );
}
