/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, ShieldCheck } from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { saveCondition } from "@/actions/saveLandingConfig";
import { toast } from "react-toastify";

const ConditionGenerale = ({ section }: { section?: any }) => {
  const [activeTab, setActiveTab] = useState<"condition" | "plitique">(
    "condition"
  );
  const [conditionContent, setConditionContent] = useState(
    section?.condition || ""
  );
  const [politiqueContent, setPolitiqueContent] = useState(
    section?.plitique || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (type: "condition" | "plitique") => {
    if (!section?.id) return;

    setIsSaving(true);
    try {
      const contentToSave =
        type === "condition" ? conditionContent : politiqueContent;
      const result = await saveCondition(section.id, type, contentToSave);

      if (result.success) {
        toast.success(
          `${
            type === "condition"
              ? "Conditions Générales"
              : "Politique de Confidentialité"
          } sauvegardées avec succès!`
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      alert("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen mt-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {activeTab === "condition" ? (
                <FileText className="w-5 h-5 text-[#D97D55]" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#D97D55]" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl">
                {activeTab === "condition"
                  ? "Conditions générales de vente"
                  : "Politique de confidentialité"}
              </CardTitle>
              <CardDescription>
                Modifiez et mettez à jour le contenu
              </CardDescription>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex mt-6 border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "condition"
                  ? "text-[#D97D55] border-b-2 border-[#D97D55]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("condition")}
            >
              Conditions de vente
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "plitique"
                  ? "text-[#D97D55] border-b-2 border-[#D97D55]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("plitique")}
            >
              Politique de confidentialité
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "condition" ? (
              <>
                <RichTextEditor
                  value={conditionContent}
                  onChange={(content) => setConditionContent(content)}
                  className="w-full min-h-[500px]"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleSave("condition")}
                    className="px-6 py-2 bg-[#D97D55] text-white rounded-lg hover:bg-[#7daa1f] transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </>
            ) : (
              <>
                <RichTextEditor
                  value={politiqueContent}
                  onChange={(content) => setPolitiqueContent(content)}
                  className="w-full min-h-[500px]"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleSave("plitique")}
                    className="px-6 py-2 bg-[#D97D55] text-white rounded-lg hover:bg-[#7daa1f] transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConditionGenerale;
