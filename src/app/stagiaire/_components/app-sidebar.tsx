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

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { title } from "process";
import { NavMain } from "@/app/admin/_components/nav-main";

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
      url: "/createur/dashboard",
      icon: House,
    },
    {
      title: "Ajouter Tour",
      url: "/createur/dashboard/tours/add",
      icon: Route,
    },
    {
      title: "Gérer l'ordre",
      url: "/createur/dashboard/order",
      icon: ListOrdered,
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
        <h1 className="text-left pt-2 pl-3 text-gray-500 text-xs font-semibold">
          Espace-Createur
        </h1>

        <NavMain items={datas.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
