/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import type * as React from "react";
import {
  House,
  BellElectric,
  Settings2,
  Users,
  SwatchBook,
  Tickets,
  PlaneTakeoff,
  Newspaper,
  ListStart,
  Star,
  MessagesSquare,
  Route,
  Headset,
  ListOrdered,
  StarHalf,
  Sparkle,
  Sparkles,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { title } from "process";

// This is sample data.
const datas = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Alert Application",
      logo: BellElectric,
      plan: "Dark Mode",
    },
  ],
  navMain: [
    {
      title: "Accueil",
      url: "/admin/dashboard",
      icon: House,
    },
    {
      title: "Tours",
      url: "#",
      icon: Route,
      items: [
        {
          title: "Créer tour",
          url: "/admin/dashboard/tours/add",
        },
        {
          title: "Gérer l'ordre",
          url: "/admin/dashboard/order",
        },
        {
          title: "Discover morocco",
          url: "/admin/dashboard/discover-morocco",
        },
        {
          title: "Discover Order",
          url: "/admin/dashboard/discover-morocco/order",
        },
      ],
    },

    {
      title: "Landing Page",
      url: "/admin/dashboard/landing",
      icon: SwatchBook,
    },
    {
      title: "Voyages",
      url: "/admin/dashboard/voyages",
      icon: PlaneTakeoff,
    },
    {
      title: "Réservations",
      url: "#",
      icon: Tickets,
      items: [
        {
          title: "Réservations Tours",
          url: "/admin/dashboard/reservations",
        },
        {
          title: "Discover Morocco",
          url: "/admin/dashboard/reservations-discover-morocco",
        },
        {
          title: "Voyages sur mesure",
          url: "/admin/dashboard/sur-mesure",
        },
        {
          title: "Team Building",
          url: "/admin/dashboard/team-building",
        },
      ],
    },

    {
      title: "Réunions",
      url: "/admin/dashboard/meetings",
      icon: Headset,
    },
    {
      title: "Utilisateurs",
      url: "/admin/dashboard/users",
      icon: Users,
    },
    {
      title: "Avis",
      url: "#",
      icon: Star,
      items: [
        {
          title: "Avis Site web",
          url: "/admin/dashboard/reviews",
        },
        {
          title: "Avis Google",
          url: "/admin/dashboard/review-google",
          icon: Newspaper,
        },
      ],
    },

    {
      title: "Blogs",
      url: "/admin/dashboard/blogs",
      icon: Newspaper,
    },
    {
      title: "NewsLetter",
      url: "/admin/dashboard/news",
      icon: MessagesSquare,
    },
    {
      title: "Settings",
      url: "/admin/dashboard/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-white dark:bg-slate-800 p-2 flex flex-col items-center justify-center bg "
    >
      <SidebarHeader className="dark:bg-slate-900 flex items-center bg-white justify-center rounded-t-xl ">
        <Image
          src={`${state === "expanded" ? "/horizontal1.png" : "/horizontal1.png"}`}
          alt="logo"
          width={state === "expanded" ? 300 : 500}
          height={state === "expanded" ? 200 : 500}
        />
      </SidebarHeader>
      <SidebarContent className="dark:bg-slate-900 pl-0 bg-white rounded-b-xl">
        <NavMain items={datas.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
