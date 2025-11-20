"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, Pen, Calendar, Users, MapPin } from "lucide-react"
import { toast } from "react-toastify"
import { getEvent, UpdateStatuEvent } from "@/actions/team-building"
import { EventForm, TravelRequestStatus } from "@prisma/client"



export default function EventDashboardPage() {
  const [requests, setRequests] = useState<EventForm[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<EventForm | null>(null)
  const [open, setOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Replace with your actual API endpoint
        // const data = await getEventRequests();

        // Mock data for demonstration
        const mockData = await getEvent()

        setRequests(mockData)
      } catch (err) {
        console.error("Error fetching event requests:", err)
        toast.error("Erreur lors du chargement des demandes")
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  const handleStatusUpdate = async (
      reservationId: string,
      newStatus: TravelRequestStatus
    ) => {
      setIsUpdatingStatus(true);
      try {
         console.log("Updating reservation", reservationId, "to status", newStatus);
        // Call your server action to update the status
        const response = await UpdateStatuEvent(reservationId, newStatus);
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

  const getStatusColor = (status: EventForm["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: EventForm["status"]) => {
    switch (status) {
      case "PENDING":
        return "Nouveau"
      case "IN_PROGRESS":
        return "En cours"
      case "COMPLETED":
        return "Terminé"
      case "CANCELED":
        return "Décliné"
      default:
        return "Inconnu"
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-12 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="mx-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Demandes d&apos;Événements</h1>
          <p className="text-gray-600">Gérez et suivez toutes les demandes de team building et d&apos;événements</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">Aucune demande trouvée.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs">
                    <th className="px-6 py-4 text-left font-semibold ">Entreprise</th>
                    <th className="px-6 py-4 text-left font-semibold ">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold ">Événement</th>
                    <th className="px-6 py-4 text-left font-semibold ">Destination</th>
                    <th className="px-6 py-4 text-left font-semibold ">Dates</th>
                    <th className="px-6 py-4 text-left font-semibold ">Budget (MAD)</th>
                    <th className="px-6 py-4 text-left font-semibold ">Statut</th>
                    <th className="px-6 py-4 text-left font-semibold ">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{req.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="">
                          <p className="font-medium text-gray-900">
                            {req.firstName} {req.lastName}
                          </p>
                          <p className="text-gray-600">{req.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">{req.eventType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {req.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(req.departureDate || undefined)} → {formatDate(req.returnDate || undefined)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-900 font-semibold">
                          {req.budgetPerPerson}
                        </div>
                      </td>
                      <td className=" py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                          {getStatusLabel(req.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                              setSelected(req)
                              setOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelected(req)
                              setIsStatusDialogOpen(true)
                            }}
                          >
                            <Pen className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mettre à jour le statut</DialogTitle>
              <DialogDescription>
                Changez le statut de la demande de {selected?.firstName} {selected?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={selected?.status === status ? "default" : "outline"}
                    className={`${selected?.status === status ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                    onClick={() => {
                      if (selected) {
                        handleStatusUpdate(selected.id, status)
                      }
                    }}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus && selected?.status === status ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      getStatusLabel(status)
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsStatusDialogOpen(false)
                  setSelected(null)
                }}
              >
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Détails de la demande d&apos;événement</DialogTitle>
              <DialogDescription>Consultez les informations complètes de cette demande.</DialogDescription>
            </DialogHeader>

            {selected && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Informations de contact</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Entreprise</p>
                      <p className="font-semibold text-gray-900">{selected.company}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nom complet</p>
                      <p className="font-semibold text-gray-900">
                        {selected.firstName} {selected.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{selected.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Téléphone</p>
                      <p className="font-semibold text-gray-900">{selected.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Détails de l&apos;événement</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Type d&apos;événement</p>
                      <p className="font-semibold text-gray-900">{selected.eventType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nombre de participants</p>
                      <p className="font-semibold text-gray-900">{selected.participants}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Destination</p>
                      <p className="font-semibold text-gray-900">{selected.destination}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Flexibilité</p>
                      <p className="font-semibold text-gray-900">{selected.dateFlexibility ? "Oui" : "Non"}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Dates</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Départ</p>
                      <p className="font-semibold text-gray-900">{formatDate(selected.departureDate || undefined)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Retour</p>
                      <p className="font-semibold text-gray-900">{formatDate(selected.returnDate || undefined)}</p>
                    </div>
                  </div>
                </div>

                {/* Accommodation */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Hébergement</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Gamme</p>
                      <p className="font-semibold text-gray-900">{selected.accommodationLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type de chambres</p>
                      <p className="font-semibold text-gray-900">{selected.roomType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hébergement</p>
                      <p className="font-semibold text-gray-900">{selected.hasAccommodation ? "Oui" : "Non"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Salle de réunion</p>
                      <p className="font-semibold text-gray-900">{selected.hasMeetingRoom ? "Oui" : "Non"}</p>
                    </div>
                  </div>
                </div>

                {/* Activities & Objectives */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Activités</h3>
                    <div className="space-y-1 text-sm">
                      {selected.activities && selected.activities.length > 0 ? (
                        selected.activities.map((activity, idx) => (
                          <p key={idx} className="text-gray-900">
                            • {activity}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-600">Aucune activité</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Enjeux</h3>
                    <div className="space-y-1 text-sm">
                      {selected.objectives && selected.objectives.length > 0 ? (
                        selected.objectives.map((objective, idx) => (
                          <p key={idx} className="text-gray-900">
                            • {objective}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-600">Aucun enjeu</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Budget & Transport */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">Budget par personne</p>
                    <p className="text-lg font-semibold text-gray-900">{selected.budgetPerPerson} MAD</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Transport</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selected.hasTransport ? "Inclus" : "Non inclus"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                {selected.projectDescription && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Description du projet</p>
                    <p className="bg-gray-50 p-3 rounded text-gray-700">{selected.projectDescription}</p>
                  </div>
                )}

                {selected.message && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Message / Besoins techniques</p>
                    <p className="bg-gray-50 p-3 rounded text-gray-700">{selected.message}</p>
                  </div>
                )}
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
    </div>
  )
}
