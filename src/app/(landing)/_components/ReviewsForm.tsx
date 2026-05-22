/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Star } from "lucide-react"; // using Lucide icons (already in ShadCN)
import { AddReview } from "@/actions/reviewActions";
import { useRouter } from "next/navigation";

export function ReviewModal({ tourId }: { tourId: any }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    message: "",
    rating: 5,
  });

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await AddReview(
        form.fullName,
        form.message,
        form.rating,
        tourId,
      );
      if (!res.success) throw new Error("Failed to submit");

      toast.success("Votre commentaire est ajouté!");
      router.refresh();
      setForm({ fullName: "", message: "", rating: 5 });
      setOpen(false);
    } catch (err) {
      toast.error("Submission failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarClick = (index: number) => {
    setForm({ ...form, rating: index + 1 });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!isLoading) setOpen(val);
      }}
    >
      <DialogTrigger asChild>
        <button className="w-full bg-[#8EBD22] text-white py-3 rounded-xl font-semibold hover:bg-[#8EBD22] transition-colors cursor-pointer">
          Ajouter un Commentaire
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Écrire un avis</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Votre nom complet"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <Textarea
          placeholder="Votre message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        {/* Star Rating */}
        <div className="flex items-center gap-1 my-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                i < form.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => handleStarClick(i)}
            />
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Soumettre"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
