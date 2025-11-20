/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Star } from "lucide-react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/actions/reviewActions";

export const reviewColumns: ColumnDef<any>[] = [
  {
    accessorKey: "authorName",
    header: "Auteur",
    cell: ({ row }) => {
      const author = row.getValue("authorName") as string;
      const profilePhoto = row.original.profilePhotoUrl;
      return (
        <div className="flex items-center gap-2">
          {profilePhoto && (
            <img 
              src={profilePhoto} 
              alt={author}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{author || "—"}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => {
      const rating = Number(row.getValue("rating"));
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: "text",
    header: "Commentaire",
    cell: ({ row }) => {
      const text = row.getValue("text") as string;
      return (
        <div className="line-clamp-2">
          {text || "—"}
        </div>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const isPublished = status === true;
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm
            ${isPublished ? "border border-green-500 bg-green-100 text-green-700" : "border border-red-500 bg-red-100 text-red-700"}`}
        >
          {isPublished ? "Publié" : "Non publié"}
        </span>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="bg-white p-2 rounded-xl border-2 border-gray-300 z-50 shadow-lg">
            <DropdownMenuLabel className="p-2 text-gray-500 font-bold">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="p-2 font-medium rounded hover:bg-gray-100 hover:cursor-pointer focus-visible:outline-0"
              onSelect={() => {
                window.location.href = `/admin/dashboard/reviews/update/${row.original.id}`;
              }}
            >
              Voir détails / Modifier
            </DropdownMenuItem>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="p-2 font-medium rounded text-red-600 hover:bg-gray-100 hover:cursor-pointer focus-visible:outline-0"
                  onSelect={e => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet avis ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. L&apos;avis sera définitivement supprimé de la base de données.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    onClick={async () => {
                      try {
                        const result = await deleteReview(row.original.id);
            
                        if (!result.success) {
                          throw new Error("Échec de la suppression de l'avis");
                        }
                        toast.success("Avis supprimé avec succès");
                        setOpen(false);
                        window.location.reload();
                      } catch (error) {
                        toast.error(`Échec de la suppression : ${String(error)}`);
                        setOpen(false);
                      }
                    }}
                  >
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];