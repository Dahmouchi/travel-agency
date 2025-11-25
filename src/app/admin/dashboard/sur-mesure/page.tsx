/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getTravelRequest,
  UpdateStatuSurMesure,
} from "@/actions/reservationsActions";
import { Eye, Loader2, Pen } from "lucide-react";
import { TravelRequestStatus } from "@prisma/client";
import { toast } from "react-toastify";

export default function TravelRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // ✅ Fetch all travel requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getTravelRequest();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching travel requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
  // 🧭 Format dates to readable string (e.g. "3 novembre 2025")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  const handleStatusUpdate = async (
    reservationId: string,
    newStatus: TravelRequestStatus
  ) => {
    setIsUpdatingStatus(true);
    try {
      console.log(
        "Updating reservation",
        reservationId,
        "to status",
        newStatus
      );
      // Call your server action to update the status
      const response = await UpdateStatuSurMesure(reservationId, newStatus);
      if (response) {
        // Update the local state to reflect the status change
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === reservationId ? { ...req, status: newStatus } : req
          )
        );
        toast.success("Statut mis à jour avec succès !");
        setIsStatusDialogOpen(false);
        setSelected(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Chargement des demandes...
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Demandes de Voyages
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">Aucune demande trouvée.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100 bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gradient-to-r from-green-600 to-lime-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Nom complet</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Destination</th>
                <th className="py-3 px-4 text-left font-medium">Dates</th>
                <th className="py-3 px-4 text-left font-medium">
                  Budget (MAD)
                </th>

                <th className="py-3 px-4 text-left">Créé le</th>
                <th>Statu</th>
                <th className="py-3 px-4 text-left font-medium">Détails</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {req.firstName} {req.lastName}
                  </td>
                  <td className="py-3 px-4">{req.email}</td>
                  <td className="py-3 px-4">{req.destination}</td>
                  <td className="py-3 px-4">
                    {new Date(req.departureDate).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(req.returnDate).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 px-4">{req.budget.toLocaleString()} </td>

                  <td className="py-3 px-4">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === "PENDING"
                          ? "bg-blue-100 text-blue-800"
                          : req.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-800"
                            : req.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {req.status === "PENDING"
                        ? "Nouveau"
                        : req.status === "IN_PROGRESS"
                          ? "En cours"
                          : req.status === "COMPLETED"
                            ? "Terminé"
                            : "Décliné"}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 flex items-center justify-center text-white"
                      onClick={() => {
                        setSelected(req);
                        setOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={"outline"}
                      onClick={() => {
                        setSelected(req);
                        setIsStatusDialogOpen(true);
                      }}
                    >
                      <Pen className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Update Reservation Status</DialogTitle>
            <DialogDescription className="text-slate-400">
              Change the status for {selected?.name}&apos;s reservation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {(
                ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"] as const
              ).map((status) => (
                <Button
                  key={status}
                  variant={selected?.status === status ? "default" : "outline"}
                  className={`${
                    selected?.status === status
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-100 border-slate-600 text-slate-700 hover:bg-slate-600"
                  }`}
                  onClick={() => {
                    if (selected) {
                      handleStatusUpdate(selected.id, status);
                    }
                  }}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    status
                  )}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsStatusDialogOpen(false);
                setSelected(null);
              }}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog for details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Détails de la demande
            </DialogTitle>
            <DialogDescription>
              Consultez les informations complètes de la demande de voyage.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p>
                  <span className="font-semibold">Nom :</span> {selected.title}{" "}
                  {selected.firstName} {selected.lastName}
                </p>
                <p>
                  <span className="font-semibold">Email :</span>{" "}
                  {selected.email}
                </p>
                <p>
                  <span className="font-semibold">Téléphone :</span>{" "}
                  {selected.countryCode} {selected.phone}
                </p>
                <p>
                  <span className="font-semibold">Ville de départ :</span>{" "}
                  {selected.departureCity}
                </p>
                <p>
                  <span className="font-semibold">Destination :</span>{" "}
                  {selected.destination}
                </p>
                <p>
                  <span className="font-semibold">Dates :</span>{" "}
                  {formatDate(selected.departureDate)} →{" "}
                  {formatDate(selected.returnDate)}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Durée :</span>{" "}
                  {selected.duration} jours
                </p>
                <p>
                  <span className="font-semibold">Budget :</span>{" "}
                  {selected.budget.toLocaleString()} €
                </p>
                <p>
                  <span className="font-semibold">Catégorie :</span>{" "}
                  {selected.accommodationCategory}
                </p>
                <p>
                  <span className="font-semibold">Chambres :</span>{" "}
                  {selected.numberOfRooms}
                </p>
                <p>
                  <span className="font-semibold">Transport :</span>{" "}
                  {selected.needsTransport}
                </p>
                <p>
                  <span className="font-semibold">Vol :</span>{" "}
                  {selected.needsFlight}
                </p>
              </div>
              <div className="col-span-2 mt-3">
                <p>
                  <span className="font-semibold">
                    Souhaits d&apos;hébergement :
                  </span>{" "}
                  {selected.accommodationWishes || "Aucun"}
                </p>
                <p>
                  <span className="font-semibold">Message :</span>{" "}
                  {selected.message || "Aucun message"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
