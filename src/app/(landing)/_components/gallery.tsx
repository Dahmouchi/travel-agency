/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Heart,
  MapPin,
  Calendar,
  Camera,
  Filter,
  Grid3X3,
  LayoutGrid,
  Maximize2,
  Play,
  Pause,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Info,
  Eye,
  Clock,
} from "lucide-react";

// Données d'exemple pour la galerie

const TravelImageGallery = ({ tour }: { tour: any[] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [layout, setLayout] = useState("grid"); // 'grid' ou 'masonry'
  const [showInfo, setShowInfo] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [zoomLevel, setZoomLevel] = useState(1);
  const programs = tour; // programs is an array of HTML strings
  const imageSrcs: string[] = [];

  programs.forEach((programHtml: any) => {
    const matches = programHtml?.description?.matchAll(
      /<img[^>]+src="([^">]+)"/g,
    );
    for (const match of matches) {
      imageSrcs.push(match[1]);
    }
  });
  // Filtrer les images selon la catégorie sélectionnée
  const filteredImages = imageSrcs;

  // Auto-play du diaporama dans la lightbox
  useEffect(() => {
    if (isPlaying && selectedImage) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === filteredImages.length - 1 ? 0 : prev + 1,
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedImage, filteredImages.length]);

  const navigateImage = (direction: any) => {
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % filteredImages.length
        : currentImageIndex === 0
          ? filteredImages.length - 1
          : currentImageIndex - 1;

    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
    setZoomLevel(1);
  };

  const toggleFavorite = (imageId: any) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavorites(newFavorites);
  };

  const handleShare = async (image: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: image.src,
        });
      } catch (err) {
        console.log("Erreur lors du partage:", err);
      }
    }
  };

  const handleDownload = (image: any) => {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = `${image.title.replace(/\s+/g, "_")}.jpg`;
    link.click();
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  if (filteredImages.length < 1) {
    return <div></div>;
  }
  return (
    <motion.section
      className="py-16 bg-gradient-to-br from-gray-50 to-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header de la galerie */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galerie Photos
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Découvrez les paysages époustouflants et les moments inoubliables de
            cette aventure
          </p>
          <div className="flex items-center justify-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>{imageSrcs.length} photos</span>
            </div>
          </div>
        </motion.div>

        {/* Filtres et contrôles */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0"
          variants={itemVariants}
        >
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2"></div>

          {/* Contrôles de mise en page */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-xl transition-colors duration-300 ${
                layout === "grid"
                  ? "bg-[#6EC207] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid3X3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setLayout("masonry")}
              className={`p-2 rounded-xl transition-colors duration-300 ${
                layout === "masonry"
                  ? "bg-[#6EC207] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LayoutGrid className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Grille d'images */}
        <motion.div
          className={`grid gap-4 ${
            layout === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "columns-1 md:columns-2 lg:columns-3 xl:columns-4"
          }`}
          variants={containerVariants}
        >
          {filteredImages.map((src, index) => (
            <motion.div
              key={index}
              className={`group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 ${
                layout === "masonry"
                  ? "break-inside-avoid mb-4"
                  : "aspect-square"
              }`}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <img
                src={src}
                alt={`${index}`}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  layout === "masonry" ? "h-auto" : "h-full"
                }`}
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TravelImageGallery;
