"use client";
import React, { useState } from "react";
import { Plus, X, Calendar as CalendarIcon, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface DateEntry {
  id: string;
  dateDebut: Date;
  dateFin: Date;
  description?: string;
  price?: number;
  visible: boolean;
}

interface DateFormProps {
  dates: DateEntry[];
  onChange: (dates: DateEntry[]) => void;
}

const DateForm: React.FC<DateFormProps> = ({ dates, onChange }) => {
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Omit<DateEntry, "id">>({
    dateDebut: undefined as unknown as Date,
    dateFin: undefined as unknown as Date,
    description: "",
    price: 0,
    visible: true,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState<Omit<DateEntry, "id">>(formState);

  const handleAddDate = () => {
    if (
      newDate.dateDebut &&
      newDate.dateFin &&
      (newDate.description ?? "").trim()
    ) {
      const newEntry: DateEntry = {
        id: Date.now().toString(),
        ...newDate,
      };
      onChange([...dates, newEntry]);
      setNewDate(formState);
      setShowAddForm(false);
    }
  };

  const handleRemove = (id: string) => {
    onChange(dates.filter((d) => d.id !== id));
  };

  const handleEdit = (date: DateEntry) => {
    setEditingDateId(date.id);
    setFormState({
      dateDebut: date.dateDebut,
      dateFin: date.dateFin,
      description: date.description,
      price: date.price ?? 0,
      visible: date.visible,
    });
  };

  const handleUpdate = () => {
    if (editingDateId && formState.dateDebut && formState.dateFin) {
      onChange(
        dates.map((d) => (d.id === editingDateId ? { ...d, ...formState } : d)),
      );
      setEditingDateId(null);
      setFormState(formState);
    }
  };

  const handleCancel = () => {
    setEditingDateId(null);
    setFormState(formState);
  };

  return (
    <div className="space-y-6">
      {dates.map((date) => (
        <Card key={date.id} className="relative">
          <CardContent className="p-6">
            {editingDateId === date.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date Début
                    </label>
                    <Input
                      type="date"
                      value={
                        formState.dateDebut instanceof Date &&
                        !isNaN(formState.dateDebut.getTime())
                          ? formState.dateDebut.toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          dateDebut: new Date(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date Fin
                    </label>
                    <Input
                      type="date"
                      value={
                        formState.dateFin instanceof Date &&
                        !isNaN(formState.dateFin.getTime())
                          ? formState.dateFin.toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          dateFin: new Date(e.target.value),
                        }))
                      }
                      min={
                        formState.dateDebut instanceof Date &&
                        !isNaN(formState.dateDebut.getTime())
                          ? formState.dateDebut.toISOString().slice(0, 10)
                          : undefined
                      }
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="Description"
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <label className="block text-sm font-medium mb-1">Prix</label>
                <Input
                  type="number"
                  placeholder="Prix"
                  value={formState.price ?? ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  min={0}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formState.visible}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        visible: e.target.checked,
                      }))
                    }
                  />
                  <span>{formState.visible ? "Visible" : "Masqué"}</span>
                </label>
                <div className="flex gap-3">
                  <div
                    onClick={handleUpdate}
                    className="
      px-4 py-2 rounded-md
      bg-primary text-primary-foreground
      hover:bg-primary/90
      cursor-pointer
      text-sm font-medium
      transition-colors
      inline-flex items-center justify-center
    "
                  >
                    Sauvegarder
                  </div>
                  <div
                    onClick={handleCancel}
                    className="
      px-4 py-2 rounded-md
      border border-input bg-background
      hover:bg-accent hover:text-accent-foreground
      cursor-pointer
      text-sm font-medium
      transition-colors
      inline-flex items-center justify-center
    "
                  >
                    Annuler
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center gap-2">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {date.dateDebut.toLocaleDateString()} →{" "}
                      {date.dateFin.toLocaleDateString()}
                    </span>
                  </div>
                  <p>{date.description}</p>
                  <p>
                    <strong>Prix:</strong> {date.price?.toFixed(2)} MAD
                  </p>
                  <p>
                    <strong>Visible:</strong> {date.visible ? "Oui" : "Non"}
                  </p>
                </div>
                <div className="flex items-center flex-col gap-2">
                  {/* Edit Button */}
                  <div
                    onClick={() => handleEdit(date)}
                    className="
      px-2.5 py-1.5 rounded-md text-sm font-medium
      bg-primary text-primary-foreground hover:bg-primary/90
      cursor-pointer transition-colors
      inline-flex items-center
    "
                  >
                    <Edit className="w-4 h-4 mr-1" />
                  </div>

                  {/* Delete Button */}
                  <div
                    onClick={() => handleRemove(date.id)}
                    className="
      px-2.5 py-1.5 rounded-md text-sm font-medium
      bg-destructive text-destructive-foreground hover:bg-destructive/90
      cursor-pointer transition-colors
      inline-flex items-center
    "
                  >
                    <X className="w-4 h-4  text-white" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {!showAddForm && (
        <div
          onClick={() => setShowAddForm(true)}
          className="w-full border-2 flex items-center justify-center rounded-xl border-dashed border-gray-300 hover:border-lime-400 hover:bg-lime-50 transition-all duration-200 py-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Ajouter Date</span>
        </div>
      )}

      {showAddForm && (
        <Card className="border-2 border-dashed border-lime-200">
          <CardContent className="p-6">
            <h4 className="mb-4 font-semibold">Ajouter Nouvelle Date</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date Début
                  </label>
                  <Input
                    type="date"
                    value={
                      newDate.dateDebut instanceof Date &&
                      !isNaN(newDate.dateDebut.getTime())
                        ? newDate.dateDebut.toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setNewDate((prev) => ({
                        ...prev,
                        dateDebut: new Date(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date Fin
                  </label>
                  <Input
                    type="date"
                    value={
                      newDate.dateFin instanceof Date &&
                      !isNaN(newDate.dateFin.getTime())
                        ? newDate.dateFin.toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setNewDate((prev) => ({
                        ...prev,
                        dateFin: new Date(e.target.value),
                      }))
                    }
                    min={
                      newDate.dateDebut instanceof Date &&
                      !isNaN(newDate.dateDebut.getTime())
                        ? newDate.dateDebut.toISOString().slice(0, 10)
                        : undefined
                    }
                  />
                </div>
              </div>
              <Textarea
                placeholder="Description"
                value={newDate.description}
                onChange={(e) =>
                  setNewDate((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Prix"
                value={newDate.price ?? ""}
                onChange={(e) =>
                  setNewDate((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                min={0}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newDate.visible}
                  onChange={(e) =>
                    setNewDate((prev) => ({
                      ...prev,
                      visible: e.target.checked,
                    }))
                  }
                />
                <span>{newDate.visible ? "Visible" : "Masqué"}</span>
              </label>
              <div className="flex gap-3">
                {/* Primary Button (Ajouter) */}
                <div
                  onClick={handleAddDate}
                  className="
      px-4 py-2 rounded-md
      bg-primary text-primary-foreground
      hover:bg-primary/90
      cursor-pointer
      text-sm font-medium
      transition-colors
      inline-flex items-center justify-center
    "
                >
                  Ajouter
                </div>

                {/* Outline Button (Annuler) */}
                <div
                  onClick={() => {
                    setShowAddForm(false);
                    setNewDate(formState);
                  }}
                  className="
      px-4 py-2 rounded-md
      border border-input bg-background
      hover:bg-accent hover:text-accent-foreground
      cursor-pointer
      text-sm font-medium
      transition-colors
      inline-flex items-center justify-center
    "
                >
                  Annuler
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DateForm;
