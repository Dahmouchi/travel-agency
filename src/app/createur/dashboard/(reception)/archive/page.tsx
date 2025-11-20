import { Shell } from "@/components/shells/shell";
import prisma from "@/lib/prisma";
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rss } from "lucide-react";
import { DataTable } from "@/app/admin/_components/tour-data-table/data-table";
import { columns } from "@/app/admin/_components/tour-data-table/columns-archived";

const Users = async () => {
  let users: Awaited<ReturnType<typeof prisma.tour.findMany>> = []; // Infer type from Prisma

  users = await prisma.tour.findMany({
    where: {
      archive: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="overflow-hidden max-w-full p-2 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Liste des Tours</h2>
        <Link href="/admin/dashboard" passHref>
      <Button
        variant="outline"
        className="group cursor-pointer relative overflow-hidden border-emerald-100 bg-white hover:bg-emerald-50 transition-colors duration-300 shadow-sm hover:shadow-md"
      >
        {/* Animated arrow */}
        <div className="absolute -left-4 group-hover:left-2 transition-all duration-300">
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex items-center gap-2 pl-4">
          <Rss className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition-transform" />
          <span className="text-emerald-800 font-medium">Retour aux tours actifs</span>
        </div>

        {/* Subtle pulse animation */}
        <div className="absolute inset-0 rounded-md bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-1000 group-hover:animate-pulse" />
      </Button>
    </Link>
      </div>

      <div className="relative w-full overflow-hidden mt-4">
        <ScrollArea className="w-full rounded-md border">
          <Shell className="p-0 sm:p-4">
            <DataTable data={users || []} columns={columns} />
          </Shell>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Users;
