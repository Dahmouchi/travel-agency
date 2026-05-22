"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import type { Category, Destination, Nature, NavbarItem } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MegaMenuPopover from "./MegaMenuPopover";

function transformNavbarItemsToMegaMenu(
  navbarItems: NavbarItem[],
  voyage?: Category[],
  nature?: Nature[],
  nationalDestinations?: Destination[],
  internationalDestinations?: Destination[],
) {
  const sortedItems = [...navbarItems].sort((a, b) => a.order - b.order);
  const visibleItems = sortedItems.filter((item) => item.isVisible);

  // Create children structure for mega menu
  const menuChildren = [];

  // Group similar items
  const destinationsItem = visibleItems.find(
    (item) => item.name === "destinations",
  );
  const voyagesItem = visibleItems.find((item) => item.name === "voyages");
  const activitiesItem = visibleItems.find(
    (item) => item.name === "activities",
  );

  if (destinationsItem) {
    const destinations = [
      ...(nationalDestinations
        ?.filter((d) => d.visible)
        .map((d) => ({
          id: d.id,
          name: d.name,
          href: `/destination/national?destinations=${d.id}`,
          isNew: false,
        })) || []),
      ...(internationalDestinations
        ?.filter((d) => d.visible)
        .map((d) => ({
          id: d.id,
          name: d.name,
          href: `/destination/international?destinations=${d.id}`,
          isNew: false,
        })) || []),
    ];

    if (destinations.length > 0) {
      menuChildren.push({
        id: "destinations-group",
        name: destinationsItem.label,
        children: destinations,
      });
    }
  }

  if (voyagesItem && voyage) {
    const voyages = voyage
      .filter((v) => v.visible)
      .map((v) => ({
        id: v.id,
        name: v.name,
        href: `/category?categorys=${v.id}`,
        isNew: false,
      }));

    if (voyages.length > 0) {
      menuChildren.push({
        id: "voyages-group",
        name: voyagesItem.label,
        children: voyages,
      });
    }
  }

  if (activitiesItem && nature) {
    const activities = nature
      .filter((n) => n.visible)
      .map((n) => ({
        id: n.id,
        name: n.name,
        href: `/nature?natures=${n.id}`,
        isNew: false,
      }));

    if (activities.length > 0) {
      menuChildren.push({
        id: "activities-group",
        name: activitiesItem.label,
        children: activities,
      });
    }
  }

  return {
    id: "mega-menu",
    name: "Menu",
    type: "mega-menu" as const,
    href: "#",
    children: menuChildren,
  };
}

export function NavbarV2({
  nationalDestinations,
  internationalDestinations,
  voyage,
  nature,
  navbarItems,
}: {
  nationalDestinations: Destination[];
  internationalDestinations: Destination[];
  voyage?: Category[];
  nature?: Nature[];
  navbarItems: NavbarItem[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedDestinationType, setSelectedDestinationType] = React.useState<
    "national" | "international"
  >("national");

  const sortedNavbarItems = [...navbarItems].sort((a, b) => a.order - b.order);

  const megamenuData = transformNavbarItemsToMegaMenu(
    navbarItems,
    voyage,
    nature,
    nationalDestinations,
    internationalDestinations,
  );

  // Featured category for mega menu (using first visible voyage as featured)
  const featuredCategory = voyage?.find((v) => v.visible) || {
    id: "featured",
    name: "Featured Tour",
    imageUrl: "/featured-tour.jpg",
    description: "Discover amazing destinations",
    visible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  const singleNavItems = sortedNavbarItems.filter(
    (item) =>
      item.isVisible &&
      !["destinations", "voyages", "activities"].includes(item.name),
  );

  return (
    <header className="relative flex items-center justify-between px-4 py-3 md:px-6 md:py-4 shadow-md bg-white w-full z-40">
      {/* Logo - Left Side */}
      <Link href="/" className="flex items-center space-x-2 z-50">
        <img
          src="/horizontal1.png"
          alt="Happy Trip"
          className="h-10 w-auto object-fit"
          style={{ maxHeight: "2.5rem" }}
        />
      </Link>

      {/* Desktop Navigation - Right Side */}
      <div className="hidden md:flex items-center gap-4">
        {/* Single nav items */}
        <nav className="flex items-center gap-1">
          {singleNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.name === "home" ? "/" : `/${item.name}`}
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mega Menu Popover */}
        <MegaMenuPopover
          megamenu={megamenuData}
          featuredCategory={featuredCategory}
        />

        {/* CTA Button */}
        <Link href="tel:+212628324880">
          <Button className="bg-[#8EBD22] hover:bg-[#7BA91F] text-white shadow-md rounded-full px-5 py-2 text-base transition-all duration-300 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Appelez-nous
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button and CTA */}
      <div className="flex items-center gap-2 md:hidden z-50">
        <Link href="tel:+212628324880">
          <Button className="bg-[#8EBD22] hover:bg-[#7BA91F] text-white shadow-md rounded-full px-3 py-2 text-xs flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>Appelez-nous</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.div>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-4">
                <Accordion type="single" collapsible className="w-full">
                  {sortedNavbarItems.map((item, index) => {
                    if (!item.isVisible) return null;

                    switch (item.name) {
                      case "home":
                      case "voyage-sur-mesure":
                      case "team-building":
                      case "discover-morocco":
                      case "blogs":
                      case "a-propos-de-nous":
                      case "contact":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href={
                                item.name === "home" ? "/" : `/${item.name}`
                              }
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-gray-100 hover:text-[#8EBD22] transition-colors duration-200"
                              onClick={handleMobileLinkClick}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        );

                      case "destinations":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <AccordionItem
                              value="destinations"
                              className="border-b border-gray-100"
                            >
                              <AccordionTrigger className="text-lg font-medium py-4 hover:text-[#8EBD22] transition-colors duration-200">
                                {item.label}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-4 pb-4">
                                  <div className="flex gap-2 mb-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={cn(
                                        "flex-1 transition-all duration-200",
                                        selectedDestinationType ===
                                          "national" &&
                                          "bg-[#8EBD22] text-white border-[#8EBD22]",
                                      )}
                                      onClick={() =>
                                        setSelectedDestinationType("national")
                                      }
                                    >
                                      National
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={cn(
                                        "flex-1 transition-all duration-200",
                                        selectedDestinationType ===
                                          "international" &&
                                          "bg-[#8EBD22] text-white border-[#8EBD22]",
                                      )}
                                      onClick={() =>
                                        setSelectedDestinationType(
                                          "international",
                                        )
                                      }
                                    >
                                      International
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {(selectedDestinationType === "national"
                                      ? nationalDestinations
                                      : internationalDestinations
                                    )
                                      .filter(
                                        (destination) => destination.visible,
                                      )
                                      .map((destination) => (
                                        <Link
                                          key={destination.id}
                                          href={`/destination/${selectedDestinationType}?destinations=${destination.id}`}
                                          className="block py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                          onClick={handleMobileLinkClick}
                                        >
                                          <div className="font-medium text-gray-900">
                                            {destination.name}
                                          </div>
                                        </Link>
                                      ))}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        );

                      case "voyages":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <AccordionItem
                              value="voyages"
                              className="border-b border-gray-100"
                            >
                              <AccordionTrigger className="text-lg font-medium py-4 hover:text-[#8EBD22] transition-colors duration-200">
                                {item.label}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-4 pb-4 space-y-3">
                                  {voyage
                                    ?.filter((voyage) => voyage.visible)
                                    .map((voyage) => (
                                      <Link
                                        key={voyage.id}
                                        href={`/category?categorys=${voyage.id}`}
                                        className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                        onClick={handleMobileLinkClick}
                                      >
                                        <img
                                          src={
                                            voyage.imageUrl ||
                                            "/placeholder.svg"
                                          }
                                          alt={voyage.name}
                                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-900 truncate">
                                            {voyage.name}
                                          </div>
                                          <p className="text-sm text-gray-500 line-clamp-1">
                                            {voyage.description}
                                          </p>
                                        </div>
                                      </Link>
                                    ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        );

                      case "activities":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <AccordionItem
                              value="activities"
                              className="border-b border-gray-100"
                            >
                              <AccordionTrigger className="text-lg font-medium py-4 hover:text-[#8EBD22] transition-colors duration-200">
                                {item.label}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-4 pb-4 space-y-3">
                                  {nature
                                    ?.filter((activity) => activity.visible)
                                    .map((activity) => (
                                      <Link
                                        key={activity.id}
                                        href={`/nature?natures=${activity.id}`}
                                        className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                        onClick={handleMobileLinkClick}
                                      >
                                        <img
                                          src={
                                            activity.imageUrl ||
                                            "/placeholder.svg"
                                          }
                                          alt={activity.name}
                                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-900 truncate">
                                            {activity.name}
                                          </div>
                                          <p className="text-sm text-gray-500 line-clamp-1">
                                            {activity.description}
                                          </p>
                                        </div>
                                      </Link>
                                    ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        );

                      default:
                        return null;
                    }
                  })}
                </Accordion>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default NavbarV2;
