/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor, // 👈 Add this
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tour } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { archiveTour, updateTourOrder } from "@/actions/toursActions";
import { toast } from "react-toastify";
import { Archive, Box } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface TourOrderManagerProps {
  nationalTours: Tour[];
  internationalTours: Tour[];
}

export default function TourOrderManager({
  nationalTours: initialNationalTours,
  internationalTours: initialInternationalTours,
}: TourOrderManagerProps) {
  const [nationalTours, setNationalTours] = useState(initialNationalTours);
  const [internationalTours, setInternationalTours] = useState(
    initialInternationalTours,
  );
  const [activeTab, setActiveTab] = useState<"NATIONAL" | "INTERNATIONAL">(
    "NATIONAL",
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync with server data
  useEffect(() => {
    setNationalTours(initialNationalTours);
    setInternationalTours(initialInternationalTours);
  }, [initialNationalTours, initialInternationalTours]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // 👈 small delay before activating drag
        tolerance: 5,
      },
    }),
  );
  const [open, setOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const reorder = (items: Tour[]) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      };

      if (activeTab === "NATIONAL") {
        setNationalTours((prev) => reorder(prev));
      } else {
        setInternationalTours((prev) => reorder(prev));
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toursToUpdate =
        activeTab === "NATIONAL" ? nationalTours : internationalTours;
      await updateTourOrder(
        toursToUpdate.map((tour, index) => ({
          id: tour.id,
          orderIndex: index + 1,
        })),
      );
      toast.success("Modifié avec succès");
    } finally {
      setIsSaving(false);
      window.location.reload();
    }
  };

  const currentTours =
    activeTab === "NATIONAL" ? nationalTours : internationalTours;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex lg:flex-row flex-col gap-2 lg:items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "NATIONAL" ? "default" : "outline"}
              className={
                activeTab === "NATIONAL"
                  ? "bg-[#8EBD22] hover:bg-[#7DA61D]"
                  : ""
              }
              onClick={() => setActiveTab("NATIONAL")}
            >
              National Tours
            </Button>
            <Button
              variant={activeTab === "INTERNATIONAL" ? "default" : "outline"}
              className={
                activeTab === "INTERNATIONAL"
                  ? "bg-[#8EBD22] hover:bg-[#7DA61D]"
                  : ""
              }
              onClick={() => setActiveTab("INTERNATIONAL")}
            >
              International Tours
            </Button>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-800 cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Order"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentTours}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {currentTours.map((tour) => (
                <SortableItem key={tour.id} id={tour.id}>
                  <div
                    className="flex items-center justify-between  p-4 border rounded-xl bg-background hover:bg-accent"
                    style={{ touchAction: "none" }} // 👈 Important for mobile dragging
                  >
                    <div className="flex items-center space-x-4 cursor-move">
                      <GripIcon className="text-muted-foreground" />
                      <span>{tour.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      Position actuelle: {tour.orderIndex}
                      <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                          <div
                            className="relative"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpen(true);
                            }}
                          >
                            <Archive className="w-5 h-5 cursor-pointer text-[#8EBD22] group-hover:scale-110 transition-transform" />
                            <Box className="absolute -bottom-1 -right-1 w-3 h-3 text-[#8EBD22]/70" />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Êtes-vous sûr de vouloir archiver ce tour ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Le tour ne sera plus visible publiquement mais
                              restera accessible dans les archives. Vous pourrez
                              le réactiver ultérieurement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setOpen(false)}>
                              Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
                              onClick={async () => {
                                try {
                                  const result = await archiveTour(tour.id); // Replace with your archive function
                                  if (!result?.success) {
                                    throw new Error(
                                      "Échec de l'archivage du tour",
                                    );
                                  }
                                  toast.success("Tour archivé avec succès");
                                  setOpen(false);
                                  window.location.reload();
                                } catch (error) {
                                  toast.error(
                                    `Échec de l'archivage : ${String(error)}`,
                                  );
                                  setOpen(false);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Archive className="w-4 h-4" />
                                <span>Confirmer l&apos;archivage</span>
                              </div>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </span>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function GripIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}
