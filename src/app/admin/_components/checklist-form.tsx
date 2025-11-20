/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Edit,
  ClipboardPenLine,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/ui/rich-text-editor-image";
import SafeHTML from "@/components/SafeHTML";
import { v4 as uuidv4 } from "uuid";

interface Program {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
}

interface ProgramFormProps {
  steps: Program[];
  isNewTour?: boolean; 
  onChange: (steps: Program[]) => void;

}

const ChecklistForm: React.FC<ProgramFormProps> = ({ steps,isNewTour, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState<
    Omit<Program, "id" | "orderIndex" | "createdAt">
  >({
    title: "",
    description: "",
   
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isNewTour && !initialized && steps.length === 0) {
      const defaultSteps: Program[] = [
       
      ];
      onChange(defaultSteps);
      setInitialized(true);
    }
  }, [isNewTour, initialized, steps.length, onChange]);
  const handleAddProgram = () => {
    if (newProgram.title.trim() && newProgram.description.trim()) {
      const program: Program = {
        id: uuidv4(),
        ...newProgram,
        orderIndex:
          steps.length > 0
            ? Math.max(...steps.map((p) => p.orderIndex)) + 1
            : 0,
      };

      onChange([...steps, program]);
      setNewProgram({
        title: "",
        description: "",
 
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveProgram = (id: string) => {
    const updatedsteps = steps
      .filter((program) => program.id !== id)
      .map((program, index) => ({
        ...program,
        orderIndex: index,
      }));

    onChange(updatedsteps);
  };

  const moveProgram = (id: string, direction: "up" | "down") => {
    const currentIndex = steps.findIndex((p) => p.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const updatedsteps = [...steps];
    // Swap the steps
    [updatedsteps[currentIndex], updatedsteps[newIndex]] = [
      updatedsteps[newIndex],
      updatedsteps[currentIndex],
    ];

    // Update orderIndex to match new positions
    updatedsteps.forEach((program, index) => {
      program.orderIndex = index;
    });

    onChange(updatedsteps);
  };

  const handleEditProgram = (id: string) => {
    const programToEdit = steps.find((p) => p.id === id);
    if (programToEdit) {
      setNewProgram({
        title: programToEdit.title,
        description: programToEdit.description,
       
      });
      setEditingProgramId(id);
      setShowAddForm(true);
    }
  };

  const handleUpdateProgram = () => {
    if (
      editingProgramId &&
      newProgram.title.trim() &&
      newProgram.description.trim()
    ) {
      const updatedsteps = steps.map((program) =>
        program.id === editingProgramId
          ? {
              ...program, // Keep all existing properties including orderIndex
              ...newProgram, // Update with new values
              orderIndex: program.orderIndex, // Explicitly preserve orderIndex
            }
          : program
      );
      onChange(updatedsteps);
      setNewProgram({
        title: "",
        description: "",
     
      });
      setEditingProgramId(null);
      setShowAddForm(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProgram((prev) => ({
          ...prev,     
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingProgramId(null);
    setNewProgram({
      title: "",
      description: "",  
    });
  };

  // Sort steps by orderIndex before rendering
  const sortedsteps = [...steps].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <div className="space-y-6">
      {/* steps List */}
      <div className="space-y-4">
        {sortedsteps.map((program, index) => {
          const isEditing = editingProgramId === program.id;

          return (
            <Card
              key={program.id}
              className="relative group hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="px-6 w-full">
                <div className="flex items-start gap-4">
                 
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-lime-100 text-lime-600 text-sm font-medium rounded-full">
                        {program.orderIndex + 1}
                      </span>

                      {isEditing ? (
                        <Input
                          value={newProgram.title}
                          onChange={(e) =>
                            setNewProgram((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <h4 className="font-semibold text-lime-700">
                          {program.title}
                        </h4>
                      )}
                    </div>

                    {isEditing ? (
                      <RichTextEditor
                        value={newProgram.description}
                        onChange={(value) =>
                          setNewProgram((prev) => ({
                            ...prev,
                            description: value,
                          }))
                        }
                      />
                    ) : (
                      <SafeHTML
                        html={program.description}
                        className="safe-html text-muted-foreground text-sm"
                      />
                    )}

                    {isEditing && (
                      <div className="mt-2 flex justify-end items-center gap-2">
                        <div
                          onClick={handleUpdateProgram}
                          className="
      px-3 py-1.5 text-sm font-medium rounded-md
      bg-primary text-primary-foreground hover:bg-primary/90
      cursor-pointer transition-colors
      flex items-center justify-center
    "
                        >
                          Enregistrer
                        </div>
                        <div
                          onClick={handleCancelEdit}
                          className="
      px-3 py-1.5 text-sm font-medium rounded-md
      bg-secondary text-secondary-foreground hover:bg-secondary/80
      border border-input cursor-pointer transition-colors
      flex items-center justify-center
    "
                        >
                          Annuler
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 ">
                    <div
                      onClick={() => moveProgram(program.id, "up")}
                      className={`p-1 rounded border select-none ${
                        index === 0
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                      title="Move up"
                    >
                      ↑
                    </div>
                    <div
                      onClick={() => moveProgram(program.id, "down")}
                      className={`p-1 rounded border select-none ${
                        index === steps.length - 1
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                      title="Move down"
                    >
                      ↓
                    </div>

                    {!isEditing && (
                      <div
                        onClick={() => handleEditProgram(program.id)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer rounded p-1.5 border "
                        title="Edit"
                      >
                        <ClipboardPenLine className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      onClick={() => handleRemoveProgram(program.id)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer rounded p-1.5 border border-destructive/20"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Program Form */}
      {showAddForm && (
        <Card className="border-none shadow-none p-0" id="editForm">
          <CardContent className="">
           
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Titre <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="Enter étape titre..."
                  value={newProgram.title}
                  onChange={(e) =>
                    setNewProgram((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <RichTextEditor
                  value={newProgram.description}
                  onChange={(value) =>
                    setNewProgram((prev) => ({ ...prev, description: value }))
                  }
                  className="w-full "
                />
              </div>

              <div className="flex gap-3 pt-2">
                <div
                  onClick={
                    editingProgramId ? handleUpdateProgram : handleAddProgram
                  }
                  className={`
      px-4 py-2 rounded-md cursor-pointer
      ${
        !newProgram.title.trim() || !newProgram.description.trim()
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-lime-600 hover:bg-lime-700"
      }
      text-white text-sm font-medium
      transition-colors duration-200
      flex items-center justify-center
    `}
                  style={{ minWidth: "150px" }}
                >
                  {editingProgramId
                    ? "Mettre à jour l'étape"
                    : "Ajouter une étape"}
                </div>
                <div
                  onClick={handleCancelEdit}
                  className={`
      px-4 py-2 rounded-md cursor-pointer
      border border-input bg-background hover:bg-accent hover:text-accent-foreground
      text-sm font-medium
      transition-colors duration-200
      flex items-center justify-center
    `}
                  style={{ minWidth: "100px" }}
                >
                  Annuler
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Program Button */}
      {!showAddForm && (
        <div
          onClick={() => setShowAddForm(true)}
          className="w-full border-2 flex items-center justify-center rounded-lg border-dashed border-gray-300 hover:border-lime-400 hover:bg-lime-50 transition-all duration-200 py-8"
        >
          <Plus className="w-5 h-5 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground">Ajouter une étape</span>
        </div>
      )}

      {steps.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-muted-foreground">
          <ClipboardPenLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-lg font-medium mb-2">
            Aucun étape ajouté pour le moment
          </p>
          <p className="text-sm">
            Cliquez sur &quot;Ajouter une étape&quot; pour créer votre
            premier étape de résérvation
          </p>
        </div>
      )}
    </div>
  );
};

export default ChecklistForm;
