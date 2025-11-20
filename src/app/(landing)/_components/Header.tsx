/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { redirect } from "next/navigation";
import { Category, Destination, Nature, NavbarItem } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar({
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

  // Fermer le menu mobile quand on clique sur un lien
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Animations variants
  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <header className="relative flex items-center justify-between px-4 py-3 md:px-6 md:py-4 shadow-md bg-white w-full z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 z-50">
        <img
          src="/horizontal.png"
          alt="Happy Trip"
          className="h-10  w-auto object-fit"
          style={{ maxHeight: "2.5rem" }}
        />
      </Link>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {sortedNavbarItems.map((item) => {
            if (!item.isVisible) return null;

            switch (item.name) {
              case "home":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      href="/"
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              case "voyage-sur-mesure":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      href="/voyage-sur-mesure"
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              case "team-building":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      href="/team-building"
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );

              case "destinations":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="flex flex-col w-[300px] p-4">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "flex-1",
                              selectedDestinationType === "national" &&
                                "bg-[#8EBD22] text-white"
                            )}
                            onMouseEnter={() =>
                              setSelectedDestinationType("national")
                            }
                          >
                            National
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "flex-1",
                              selectedDestinationType === "international" &&
                                "bg-[#8EBD22] text-white"
                            )}
                            onMouseEnter={() =>
                              setSelectedDestinationType("international")
                            }
                          >
                            International
                          </Button>
                        </div>
                        <ul className="flex flex-col gap-2">
                          {(selectedDestinationType === "national"
                            ? nationalDestinations
                            : internationalDestinations
                          )
                            .filter((destination) => destination.visible)
                            .map((destination) => (
                              <li key={destination.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/destination/${selectedDestinationType}?destinations=${destination.id}`}
                                    className={cn(
                                      "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    )}
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {destination.name}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );

              case "voyages":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[500px] md:w-[600px] lg:w-[800px]">
                      <div className="flex justify-center">
                        <div className="flex flex-nowrap overflow-x-auto gap-4 p-4 w-full">
                          {voyage
                            ?.filter((voyage) => voyage.visible)
                            .map((voyage) => (
                              <NavigationMenuLink asChild key={voyage.id}>
                                <Link
                                  href={`/category?categorys=${voyage.id}`}
                                  className="flex-shrink-0 flex flex-col items-center rounded-md p-3 hover:bg-accent transition-colors min-w-[200px]"
                                >
                                  <img
                                    src={voyage.imageUrl}
                                    alt={voyage.name}
                                    className="w-56 h-40 object-cover rounded mb-2"
                                  />
                                  <span className="text-sm w-56 font-medium text-center">
                                    {voyage.name}
                                  </span>
                                  <p className="line-clamp-2 w-56 text-xs text-muted-foreground">
                                    {voyage.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );

              case "activities":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[500px] md:w-[600px] lg:w-[800px]">
                      <div className="flex justify-center">
                        <div className="flex flex-nowrap overflow-x-auto gap-4 p-4 w-full">
                          {nature
                            ?.filter((activity) => activity.visible)
                            .map((activity) => (
                              <NavigationMenuLink asChild key={activity.name}>
                                <Link
                                  href={`/nature?natures=${activity.id}`}
                                  className="flex-shrink-0 flex flex-col items-center rounded-md p-3 hover:bg-accent transition-colors min-w-[200px]"
                                >
                                  <img
                                    src={activity.imageUrl}
                                    alt={activity.id}
                                    className="w-56 h-40 object-cover rounded mb-2"
                                  />
                                  <span className="text-sm w-56 font-medium text-center">
                                    {activity.name}
                                  </span>
                                  <p className="line-clamp-2 w-56 text-xs text-muted-foreground">
                                    {activity.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );

              case "blogs":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      href="/blogs"
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              case "discover-morocco":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      href="/discover-morocco"
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              case "a-apropos-de-nous":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      href="/a-propos-de-nous"
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              case "contact":
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      href="/contact"
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );

              default:
                return null;
            }
          })}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Menu Button and CTA */}
      <div className="flex items-center gap-2 md:gap-4 z-50">
        {/* CTA Button */}
        <Link href="tel:+212628324880">
          <Button className="bg-[#8EBD22] hover:bg-[#7BA91F] text-white shadow-md rounded-full px-3 py-2 text-xs md:px-5 md:py-2 md:text-base transition-all duration-300 flex items-center gap-1">
            <Phone className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Appelez-nous</span>
            <span className="sm:hidden">Appelez-nous</span>
          </Button>
        </Link>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative z-50 hover:bg-gray-100 transition-colors duration-200"
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
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
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
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href="/"
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-gray-100 hover:text-[#8EBD22] transition-colors duration-200"
                              onClick={handleMobileLinkClick}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        );

                      case "voyage-sur-mesure":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href="/voyage-sur-mesure"
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-gray-100 hover:text-[#8EBD22] transition-colors duration-200"
                              onClick={handleMobileLinkClick}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        );

                      case "team-building":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href="/team-building"
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-gray-100 hover:text-[#8EBD22] transition-colors duration-200"
                              onClick={handleMobileLinkClick}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        );

                      case "discover-morocco":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href="/discover-morocco"
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
                                          "bg-[#8EBD22] text-white border-[#8EBD22]"
                                      )}
                                      onClick={() => {
                                        setSelectedDestinationType("national");
                                      }}
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
                                          "bg-[#8EBD22] text-white border-[#8EBD22]"
                                      )}
                                      onClick={() => {
                                        setSelectedDestinationType(
                                          "international"
                                        );
                                      }}
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
                                        (destination) => destination.visible
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
                                          src={voyage.imageUrl}
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
                                          src={activity.imageUrl}
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

                      case "blogs":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href="/blogs"
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-gray-100 hover:text-[#8EBD22] transition-colors duration-200"
                              onClick={handleMobileLinkClick}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        );

                      case "a-apropos-de-nous":
                        return (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href="/a-propos-de-nous"
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-gray-100 hover:text-[#8EBD22] transition-colors duration-200"
                              onClick={handleMobileLinkClick}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        );

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
                              href="/contact"
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-gray-100 hover:text-[#8EBD22] transition-colors duration-200"
                              onClick={handleMobileLinkClick}
                            >
                              {item.label}
                            </Link>
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

export default Navbar;
