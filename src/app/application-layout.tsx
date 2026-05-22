/* eslint-disable @typescript-eslint/no-unused-vars */
import FooterQuickNavigation from "@/components/FooterQuickNavigation";
import HeroSearchFormMobile from "@/components/HeroSearchFormMobile/HeroSearchFormMobile";
import Aside from "@/components/aside";
import AsideSidebarNavigation from "@/components/aside-sidebar-navigation";
import prisma from "@/lib/prisma";
import "rc-slider/assets/index.css";
import React, { ReactNode } from "react";
import { Category, Destination, Landing, Nature } from "@prisma/client";
import Navbar from "./(landing)/_components/Header";
import Link from "next/link";
import Footer2 from "@/components/footer/Footer2";
import ChatAgent from "./(landing)/_components/ai-agent";

interface Props {
  children: ReactNode;
  header?: ReactNode;
}

const ApplicationLayout: React.FC<Props> = async ({ children, header }) => {
  const sections: Landing | null = await prisma.landing.findFirst({});
  const destinationNational: Destination[] | null =
    await prisma.destination.findMany({
      where: {
        type: "NATIONAL",
        visible: true,
      },
    });
  const category: Category[] | null = await prisma.category.findMany({});
  const nature: Nature[] | null = await prisma.nature.findMany({});
  const destinationInternational: Destination[] | null =
    await prisma.destination.findMany({
      where: {
        type: "INTERNATIONAL",
        visible: true,
      },
    });
  const navbarItem = await prisma.navbarItem.findMany({
    where: {
      isVisible: true,
    },
    orderBy: { order: "asc" },
  });
  return (
    <Aside.Provider>
      {/* Navbar — mobile drawer + desktop floating pill */}
      <div className="relative z-50">
        {header ? (
          header
        ) : (
          <Navbar
            nationalDestinations={destinationNational}
            internationalDestinations={destinationInternational}
            voyage={category}
            nature={nature}
            navbarItems={navbarItem}
          />
        )}
      </div>
      {/* HeroSearchFormMobile - will display on mobile devices instead of Header-desktop
      <div className="sticky top-0 z-20 bg-white shadow-xs lg:hidden dark:bg-neutral-900">
        <div className="container flex h-20 items-center justify-center">
          <HeroSearchFormMobile />
        </div>
      </div> */}
      {/*  */}
      <div className="pt-16 lg:pt-0">{children}</div>
      {/*  */}
      {/* FooterQuickNavigation - Displays on mobile devices and is fixed at the bottom of the screen */}
      <FooterQuickNavigation />
      {/* Chose footer style here!!!! */}
      <Footer2 /> {/* <Footer /> or <Footer2 /> or <Footer3 /> or <Footer4 />*/}
      {/* 
      <ChatAgent
        agentName="Travel Assistant"
        welcomeMessage="Bonjour! 👋 Je suis votre assistant voyage. Comment puis-je vous aider à planifier votre aventure parfaite?"
        suggestions={[
          "Quels tours recommandez-vous?",
          "Informations sur les prix",
          "Meilleure période pour visiter?",
          "Réductions de groupe?",
        ]}
      /> */}
      <AsideSidebarNavigation
        navItem={navbarItem}
        nationalDestinations={destinationNational}
        internationalDestinations={destinationInternational}
      />
    </Aside.Provider>
  );
};

export { ApplicationLayout };
