/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Review, ReviewStatus } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // adjust the import path if needed

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { DeleteReview, UpdateReviewStatus } from "@/actions/reviewActions";

type ReviewData = Review & {
  tourTitle: string;
};

export const reviewColumns = ({
  refresh,
}: {
  refresh: () => void;
}): ColumnDef<ReviewData, unknown>[] => [
  {
    accessorKey: "tourTitle",
    header: "Titre du circuit",
    cell: ({ row }) => <span>{row.getValue("tourTitle")}</span>,
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => row.getValue("rating"),
  },
  {
    accessorKey: "message",
    header: "Commentaire",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      return (
        <>
          <div
            className="line-clamp-2 cursor-pointer hover:underline max-w-[280px]"
            onClick={() => setIsDialogOpen(true)}
          >
            {message}
          </div>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Commentaire complet</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="max-h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-md">
                {message}
              </div>
              <AlertDialogFooter>
                <AlertDialogAction>Fermer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Nom complet",
    cell: ({ row }) => row.getValue("fullName"),
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt")).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as ReviewStatus;
      const id = row.original.id;

      const statusStyles: Record<ReviewStatus, string> = {
        [ReviewStatus.PENDING]: "bg-yellow-100 text-yellow-800",
        [ReviewStatus.APPROVED]: "bg-green-200 text-green-800",
        [ReviewStatus.REJECTED]: "bg-red-100 text-red-800",
      };

      return (
        <select
          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] ?? "bg-gray-100 text-gray-800"}`}
          value={status}
          onChange={async (e) => {
            const newStatus = e.target.value as ReviewStatus;
            try {
              const response = await UpdateReviewStatus(id, newStatus);
              if (response.success) {
                toast.success("Statut mis à jour !");
                refresh();
              } else {
                toast.error("Erreur lors de la mise à jour du statut");
              }
            } catch (error) {
              toast.error("Erreur inattendue");
            }
          }}
        >
          <option value={ReviewStatus.PENDING}>En attente</option>
          <option value={ReviewStatus.APPROVED}>Approuvé</option>
          <option value={ReviewStatus.REJECTED}>Rejeté</option>
        </select>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const reviewId = row.original.id;
      const [open, setOpen] = useState(false);

      const handleDelete = async () => {
        try {
          const response = await DeleteReview(reviewId);
          if (response.success) {
            toast.success("Avis supprimé avec succès !");
            refresh();
          } else {
            toast.error("Erreur lors de la suppression de l'avis");
          }
        } catch (error) {
          toast.error("Erreur inattendue");
        } finally {
          setOpen(false);
        }
      };

      return (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L’avis sera définitivement
                supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
