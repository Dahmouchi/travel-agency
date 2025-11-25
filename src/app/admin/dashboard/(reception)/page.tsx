import { Shell } from "@/components/shells/shell";
import prisma from "@/lib/prisma";
import React from "react";
import { DataTable } from "../../_components/tour-data-table/data-table";
import { columns } from "../../_components/tour-data-table/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Archive, Box } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Users = async () => {
  let users: Awaited<ReturnType<typeof prisma.tour.findMany>> = []; // Infer type from Prisma

  users = await prisma.tour.findMany({
    where: {
      isDiscover: false,
      archive: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="overflow-hidden max-w-full p-2 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Liste des Tours</h2>
        <div>
          <Link href="/admin/dashboard/archive" passHref>
            <Button
              variant="outline"
              className="group cursor-pointer relative overflow-hidden border-[#D97D55]/40 bg-white/90 hover:bg-[#f8faf3] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Animated background element */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-full h-full bg-[url('/pattern.svg')] bg-[length:100px_100px] opacity-5" />
              </div>

              {/* Main content */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="relative">
                  <Archive className="w-5 h-5 text-[#D97D55] group-hover:scale-110 transition-transform" />
                  <Box className="absolute -bottom-1 -right-1 w-3 h-3 text-[#D97D55]/70" />
                </div>
                <span className="text-[#5a7c15] font-medium">
                  Voir les tours archivés
                </span>
              </div>

              {/* Animated arrow (optional) */}
              <span className="ml-2 text-[#D97D55] opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                →
              </span>
            </Button>
          </Link>
        </div>
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
