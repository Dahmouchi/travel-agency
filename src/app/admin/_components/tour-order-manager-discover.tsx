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
import { updateTourOrder } from "@/actions/toursActions";
import { toast } from "react-toastify";
import { updateTourOrderDiscover } from "@/actions/discover";

interface TourOrderManagerProps {
  nationalTours: Tour[];
}

export default function TourOrderManagerDiscover({
  nationalTours: initialNationalTours,
}: TourOrderManagerProps) {
  const [nationalTours, setNationalTours] = useState(initialNationalTours);
  const [activeTab, setActiveTab] = useState<"NATIONAL" | "INTERNATIONAL">(
    "NATIONAL",
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync with server data
  useEffect(() => {
    setNationalTours(initialNationalTours);
  }, [initialNationalTours]);

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
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toursToUpdate = nationalTours;
      await updateTourOrderDiscover(
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

  const currentTours = activeTab === "NATIONAL" ? nationalTours : nationalTours;

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
              Discover Morocco Tours
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
                    className="flex items-center justify-between cursor-move p-4 border rounded-xl bg-background hover:bg-accent"
                    style={{ touchAction: "none" }} // 👈 Important for mobile dragging
                  >
                    <div className="flex items-center space-x-4">
                      <GripIcon className="text-muted-foreground" />
                      <span>{tour.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Position actuelle: {tour.orderIndex}
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
