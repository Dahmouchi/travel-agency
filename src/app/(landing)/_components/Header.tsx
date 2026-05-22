/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Globe,
  Compass,
  Users,
  BookOpen,
  Home,
  Info,
  Mail,
  Trees,
} from "lucide-react";
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
import { Category, Destination, Nature, NavbarItem } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

const navIcons: Record<string, React.ElementType> = {
  home: Home,
  "voyage-sur-mesure": Compass,
  "team-building": Users,
  destinations: MapPin,
  voyages: Globe,
  activities: Trees,
  blogs: BookOpen,
  "discover-morocco": Globe,
  "a-propos-de-nous": Info,
  contact: Mail,
};

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

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ─── DESKTOP HEADER (lg+) ─── */}
      <header className="absolute w-[90%] lg:flex hidden top-4 left-1/2 -translate-x-1/2 mt-3 rounded-full border border-neutral-200 items-center justify-between px-4 py-3 md:px-6 md:py-1 shadow-md bg-white z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 z-50">
          <img
            src="/horizontal1.png"
            alt="Happy Trip"
            className="h-14 w-auto object-fit"
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
                      <NavigationMenuTrigger>
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex flex-col w-[300px] p-4">
                          <div className="flex gap-2 mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "flex-1",
                                selectedDestinationType === "national" &&
                                  "bg-[#8EBD22] text-white",
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
                                  "bg-[#8EBD22] text-white",
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
                                        "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
                      <NavigationMenuTrigger>
                        {item.label}
                      </NavigationMenuTrigger>
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
                      <NavigationMenuTrigger>
                        {item.label}
                      </NavigationMenuTrigger>
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
                case "a-propos-de-nous":
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

        {/* Desktop CTA */}
        <Link href="tel:+212628324880">
          <Button className="bg-[#8EBD22] cursor-pointer hover:bg-[#56DFCF] text-white shadow-md rounded-full px-5 py-2 text-base transition-all duration-300 flex items-center gap-1">
            <Phone className="w-4 h-4" />
            Appelez-nous
          </Button>
        </Link>
      </header>

      {/* ─── MOBILE HEADER (< lg) ─── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            onClick={handleMobileLinkClick}
          >
            <img
              src="/horizontal1.png"
              alt="Happy Trip"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link href="tel:+212628324880">
              <Button className="bg-[#8EBD22] hover:bg-[#56DFCF] text-white rounded-full px-3 py-2 text-xs flex items-center gap-1 shadow-sm">
                <Phone className="w-3.5 h-3.5" />
                <span>Appelez-nous</span>
              </Button>
            </Link>

            {/* Hamburger */}
            <button
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8EBD22]/40"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5 text-gray-700" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#8EBD22]/10 to-transparent">
                <Link href="/" onClick={handleMobileLinkClick}>
                  <img
                    src="/horizontal1.png"
                    alt="Happy Trip"
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Drawer body — scrollable */}
              <div className="flex-1 overflow-y-auto py-3 px-4">
                <Accordion type="single" collapsible className="w-full">
                  {sortedNavbarItems.map((item, index) => {
                    if (!item.isVisible) return null;

                    const IconComponent = navIcons[item.name] ?? Globe;

                    const simpleLinkClass =
                      "flex items-center gap-3 w-full px-3 py-3.5 rounded-xl text-gray-700 hover:bg-[#8EBD22]/8 hover:text-[#8EBD22] transition-all duration-200 group";

                    switch (item.name) {
                      case "home":
                      case "voyage-sur-mesure":
                      case "team-building":
                      case "discover-morocco":
                      case "blogs":
                      case "a-propos-de-nous":
                      case "contact": {
                        const hrefs: Record<string, string> = {
                          home: "/",
                          "voyage-sur-mesure": "/voyage-sur-mesure",
                          "team-building": "/team-building",
                          "discover-morocco": "/discover-morocco",
                          blogs: "/blogs",
                          "a-propos-de-nous": "/a-propos-de-nous",
                          contact: "/contact",
                        };
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <Link
                              href={hrefs[item.name]}
                              className={simpleLinkClass}
                              onClick={handleMobileLinkClick}
                            >
                              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8EBD22]/10 text-[#8EBD22] group-hover:bg-[#8EBD22] group-hover:text-white transition-all duration-200 flex-shrink-0">
                                <IconComponent className="w-4 h-4" />
                              </span>
                              <span className="font-medium text-sm">
                                {item.label}
                              </span>
                            </Link>
                          </motion.div>
                        );
                      }

                      case "destinations":
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <AccordionItem
                              value="destinations"
                              className="border-none"
                            >
                              <AccordionTrigger className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#8EBD22]/8 hover:text-[#8EBD22] hover:no-underline transition-all duration-200 group [&>svg]:ml-auto [&>svg]:text-gray-400">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8EBD22]/10 text-[#8EBD22] group-hover:bg-[#8EBD22] group-hover:text-white transition-all duration-200 flex-shrink-0">
                                  <MapPin className="w-4 h-4" />
                                </span>
                                <span className="font-medium text-sm text-gray-700 group-hover:text-[#8EBD22]">
                                  {item.label}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-1 pt-0 px-3">
                                <div className="ml-11 border-l-2 border-[#8EBD22]/20 pl-4">
                                  <div className="flex gap-2 mb-3 mt-1">
                                    <button
                                      className={cn(
                                        "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all duration-200",
                                        selectedDestinationType === "national"
                                          ? "bg-[#8EBD22] text-white border-[#8EBD22]"
                                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#8EBD22]/50",
                                      )}
                                      onClick={() =>
                                        setSelectedDestinationType("national")
                                      }
                                    >
                                      National
                                    </button>
                                    <button
                                      className={cn(
                                        "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all duration-200",
                                        selectedDestinationType ===
                                          "international"
                                          ? "bg-[#8EBD22] text-white border-[#8EBD22]"
                                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#8EBD22]/50",
                                      )}
                                      onClick={() =>
                                        setSelectedDestinationType(
                                          "international",
                                        )
                                      }
                                    >
                                      International
                                    </button>
                                  </div>
                                  <div className="space-y-0.5">
                                    {(selectedDestinationType === "national"
                                      ? nationalDestinations
                                      : internationalDestinations
                                    )
                                      .filter((d) => d.visible)
                                      .map((destination) => (
                                        <Link
                                          key={destination.id}
                                          href={`/destination/${selectedDestinationType}?destinations=${destination.id}`}
                                          className="flex items-center gap-2 py-2 px-2 rounded-lg text-sm text-gray-600 hover:text-[#8EBD22] hover:bg-[#8EBD22]/5 transition-all duration-200"
                                          onClick={handleMobileLinkClick}
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#8EBD22]/40 flex-shrink-0" />
                                          {destination.name}
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
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <AccordionItem
                              value="voyages"
                              className="border-none"
                            >
                              <AccordionTrigger className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#8EBD22]/8 hover:text-[#8EBD22] hover:no-underline transition-all duration-200 group [&>svg]:ml-auto [&>svg]:text-gray-400">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8EBD22]/10 text-[#8EBD22] group-hover:bg-[#8EBD22] group-hover:text-white transition-all duration-200 flex-shrink-0">
                                  <Globe className="w-4 h-4" />
                                </span>
                                <span className="font-medium text-sm text-gray-700 group-hover:text-[#8EBD22]">
                                  {item.label}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-1 pt-0 px-3">
                                <div className="ml-11 border-l-2 border-[#8EBD22]/20 pl-4 space-y-1 mt-1">
                                  {voyage
                                    ?.filter((v) => v.visible)
                                    .map((v) => (
                                      <Link
                                        key={v.id}
                                        href={`/category?categorys=${v.id}`}
                                        className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#8EBD22]/5 transition-all duration-200 group/item"
                                        onClick={handleMobileLinkClick}
                                      >
                                        <img
                                          src={v.imageUrl}
                                          alt={v.name}
                                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <div className="text-sm font-medium text-gray-700 group-hover/item:text-[#8EBD22] truncate transition-colors">
                                            {v.name}
                                          </div>
                                          <p className="text-xs text-gray-400 line-clamp-1">
                                            {v.description}
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
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <AccordionItem
                              value="activities"
                              className="border-none"
                            >
                              <AccordionTrigger className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#8EBD22]/8 hover:text-[#8EBD22] hover:no-underline transition-all duration-200 group [&>svg]:ml-auto [&>svg]:text-gray-400">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8EBD22]/10 text-[#8EBD22] group-hover:bg-[#8EBD22] group-hover:text-white transition-all duration-200 flex-shrink-0">
                                  <Trees className="w-4 h-4" />
                                </span>
                                <span className="font-medium text-sm text-gray-700 group-hover:text-[#8EBD22]">
                                  {item.label}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-1 pt-0 px-3">
                                <div className="ml-11 border-l-2 border-[#8EBD22]/20 pl-4 space-y-1 mt-1">
                                  {nature
                                    ?.filter((a) => a.visible)
                                    .map((activity) => (
                                      <Link
                                        key={activity.id}
                                        href={`/nature?natures=${activity.id}`}
                                        className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#8EBD22]/5 transition-all duration-200 group/item"
                                        onClick={handleMobileLinkClick}
                                      >
                                        <img
                                          src={activity.imageUrl}
                                          alt={activity.name}
                                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <div className="text-sm font-medium text-gray-700 group-hover/item:text-[#8EBD22] truncate transition-colors">
                                            {activity.name}
                                          </div>
                                          <p className="text-xs text-gray-400 line-clamp-1">
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

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/80">
                <Link href="tel:+212628324880" onClick={handleMobileLinkClick}>
                  <button className="w-full flex items-center justify-center gap-2 bg-[#8EBD22] hover:bg-[#09a9a4] text-white rounded-2xl py-3.5 font-semibold text-sm transition-all duration-200 shadow-md shadow-[#8EBD22]/30 active:scale-95">
                    <Phone className="w-4 h-4" />
                    Appelez-nous
                  </button>
                </Link>
                <p className="text-center text-xs text-gray-400 mt-3">
                  © Happy Trip — Votre agence de voyage
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
