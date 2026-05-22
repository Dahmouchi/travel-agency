"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TravelImageGallery({ images = [] }: any) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  if (!images || images.length === 0) return null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === null ? null : (prev + 1) % images.length,
      );
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === null ? null : (prev - 1 + images.length) % images.length,
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <span className="text-primary">Galerie</span> Photos
      </h2>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {images.map((image: any, index: any) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "relative group overflow-hidden rounded-xl cursor-pointer bg-gray-100",
              // First image is large (2x2)
              index === 0 && "md:col-span-2 md:row-span-2",
              // Every 7th image is wide (2x1)
              index % 7 === 0 && index !== 0 && "md:col-span-2",
              // Every 11th image is tall (1x2)
              index % 11 === 0 && index !== 0 && "md:row-span-2",
            )}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.url}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Expand className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={handleClose}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 p-2"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
              <button
                onClick={handlePrev}
                className="absolute left-0 p-4 text-white/70 hover:text-white transition-colors z-50 hover:bg-white/10 rounded-full"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>

              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={images[selectedImageIndex].url}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                className="max-h-[90vh] max-w-full object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              <button
                onClick={handleNext}
                className="absolute right-0 p-4 text-white/70 hover:text-white transition-colors z-50 hover:bg-white/10 rounded-full"
              >
                <ChevronRight className="w-10 h-10" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
