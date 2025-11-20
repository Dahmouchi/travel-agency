/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Star, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
interface Reservation {
  id: string;
  nom: string;
  clientName: string;
  email: string;
  createdAt: string | Date;
  travelDate?: {
    startDate?: Date;
    endDate?: Date;
  };
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

 const exportToExcel = () => {
  const exportColumns = [
    { key: "nom", header: "Nom" },
    { key: "prenom", header: "Prénom" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Téléphone" },
    { key: "tour.title", header: "Circuit" },
    { key: "data.numberOfAdults", header: "Nombre d'adultes" },
    { key: "createdAt", header: "Date de réservation" },
    { key: "startDate", header: "Date de début" },  // New separate column
    { key: "endDate", header: "Date de fin" },      // New separate column
    { key: "finalPrice", header: "Prix total (MAD)" },
    { key: "status", header: "Statut" },
    { key: "customFields", header: "Options supplémentaires" },
  ] as const;

  // Prepare data for export
  const exportData = data.map((item: any) => {
    const row: Record<string, any> = {};

    exportColumns.forEach(({ key, header }) => {
      switch (key) {
        case "createdAt":
          row[header] = item[key]
            ? new Date(item[key]).toLocaleString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";
          break;

        case "startDate":
        case "endDate":
          row[header] = item[key]
            ? new Date(item[key]).toLocaleDateString("fr-FR")
            : "";
          break;

        case "status":
          row[header] = translateStatus(item[key]);
          break;

        case "customFields":
          // Format custom fields as a string
          const customFields = item[key];
          if (customFields) {
            const fields = Object.entries(customFields)
              .filter(([_, value]) => value !== false && value !== 0)
              .map(([field, value]) => {
                if (typeof value === 'boolean') return field;
                if (field.endsWith('_count')) return '';
                return `${field}: ${value}`;
              })
              .filter(Boolean);
            row[header] = fields.join(', ');
          } else {
            row[header] = "";
          }
          break;

        default:
          // Handle nested properties (like tour.title)
          if (key.includes('.')) {
            const keys = key.split('.');
            let value = item;
            for (const k of keys) {
              value = value?.[k];
              if (value === undefined) break;
            }
            row[header] = value ?? "";
          } else {
            row[header] = item[key] ?? "";
          }
          break;
      }
    });

    return row;
  });

  // Create worksheet with auto-width columns
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Update column widths to accommodate new columns
  const colWidths = [
    { wch: 20 }, // Nom
    { wch: 20 }, // Prénom
    { wch: 25 }, // Email
    { wch: 15 }, // Téléphone
    { wch: 30 }, // Circuit
    { wch: 15 }, // Nombre d'adultes
    { wch: 20 }, // Date réservation
    { wch: 15 }, // Date de début (new)
    { wch: 15 }, // Date de fin (new)
    { wch: 15 }, // Prix total
    { wch: 15 }, // Statut
    { wch: 40 }, // Options supplémentaires
  ];
  worksheet["!cols"] = colWidths;

  // Add header style
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F81BD" } },
    alignment: { horizontal: "center" }
  };

  // Apply style to header row
  for (let i = 0; i < exportColumns.length; i++) {
    const cellRef = XLSX.utils.encode_cell({ c: i, r: 0 });
    if (!worksheet[cellRef]) continue;
    worksheet[cellRef].s = headerStyle;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Réservations");
  XLSX.writeFile(workbook, `reservations_${new Date().toISOString().slice(0,10)}.xlsx`, { 
    compression: true 
  });
};

  const translateStatus = (
    status: "PENDING" | "CONFIRMED" | "CANCELED"
  ): string => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "CONFIRMED":
        return "Confirmée";
      case "CANCELED":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between py-4 px-4">
        <div onClick={()=>console.log(data)}>test</div>
        <Input
          placeholder="Filtrer par le Nom..."
          value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("nom")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <Button onClick={exportToExcel} className="gap-2">
          <Download size={16} />
          Exporter Excel
        </Button>
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={idx % 2 === 1 ? "bg-lime-50" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "rating" ? (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < (row.getValue("rating") as number)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 pr-4">
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
