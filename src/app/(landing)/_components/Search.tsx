/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

// Interface pour définir la structure d'un tour
interface Tour {
  id: string | number;
  title: string;
  active: boolean;
  description?: string;
  location?: string;
  price?: number;
  duration?: string;
  imageUrl?: string;
}

// Interface pour les props du composant
interface SearchInputProps {
  tours: Tour[];
  placeholder?: string;
  maxResults?: number;
  searchFields?: (keyof Tour)[];
  onSelect?: (tour: Tour) => void;
  className?: string;
  debounceMs?: number;
  showImages?: boolean;
  customResultRenderer?: (tour: Tour) => React.ReactNode;
}

export function OptimizedSearchInput({
  tours = [],
  placeholder = "Rechercher un voyage...",
  maxResults = 10,
  searchFields = ["title", "description", "location"],
  onSelect,
  className = "",
  debounceMs = 300,
  showImages = false,
  customResultRenderer,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  // Filtrer et mémoriser les tours actifs
  const activeTours = useMemo(() => {
    return tours.filter((tour) => tour.active === true);
  }, [tours]);

  // Fonction de recherche optimisée avec mémorisation
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return activeTours.slice(0, maxResults);
    }

    const searchTerm = query.toLowerCase().trim();

    return activeTours
      .filter((tour) => {
        return searchFields.some((field) => {
          const fieldValue = tour[field];
          return (
            fieldValue && String(fieldValue).toLowerCase().includes(searchTerm)
          );
        });
      })
      .sort((a, b) => {
        // Prioriser les correspondances exactes dans le titre
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) {
          return -1;
        }
        if (!aTitle.startsWith(searchTerm) && bTitle.startsWith(searchTerm)) {
          return 1;
        }

        return aTitle.localeCompare(bTitle);
      })
      .slice(0, maxResults);
  }, [query, activeTours, maxResults, searchFields]);

  // Gestionnaire de sélection avec callback
  const handleSelect = useCallback(
    (tour: Tour) => {
      if (onSelect) {
        onSelect(tour);
      } else {
        router.push(`/voyage/${tour.id}`);
      }
      setShowSuggestions(false);
      setQuery("");
      setSelectedIndex(-1);
    },
    [onSelect, router]
  );

  // Gestion du focus
  const handleFocus = useCallback(() => {
    setShowSuggestions(true);
    setSelectedIndex(-1);
  }, []);

  // Gestion de la perte de focus avec délai
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  }, []);

  // Gestion des touches clavier pour la navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || searchResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleSelect(searchResults[selectedIndex]);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showSuggestions, searchResults, selectedIndex, handleSelect]
  );

  // Rendu par défaut d'un résultat
  const defaultResultRenderer = useCallback(
    (tour: Tour, index: number) => (
      <li
        key={tour.id}
        onClick={() => handleSelect(tour)}
        onMouseEnter={() => setSelectedIndex(index)}
        className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center gap-3 ${
          selectedIndex === index
            ? "bg-blue-50 border-l-4 border-blue-500"
            : "hover:bg-gray-50"
        }`}
      >
        {showImages && tour.imageUrl && (
          <img
            src={tour.imageUrl}
            alt={tour.title}
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{tour.title}</div>
          {tour.location && (
            <div className="text-sm text-gray-500 truncate">
              📍 {tour.location}
            </div>
          )}
          {tour.price && (
            <div className="text-sm text-green-600 font-medium">
              À partir de {tour.price}€
            </div>
          )}
        </div>
        {tour.duration && (
          <div className="text-xs text-gray-400 flex-shrink-0">
            ⏱️ {tour.duration}
          </div>
        )}
      </li>
    ),
    [selectedIndex, showImages, handleSelect]
  );

  return (
    <div className={`relative w-full max-w-xl z-50 ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 h-full pr-20"
          autoComplete="off"
        />
        <button className="rounded-bl-full rounded-r-full h-full bg-gradient-to-b from-[#D97D55] to-[#ef6b32] px-3 text-white absolute right-0 top-0 flex items-center justify-center">
          Rechercher
        </button>
      </div>

      {/* Dropdown des suggestions */}
      {showSuggestions && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden z-50">
          {searchResults.length > 0 ? (
            <ul className="overflow-y-auto max-h-96 text-left">
              {searchResults.map((tour, index) =>
                customResultRenderer
                  ? customResultRenderer(tour)
                  : defaultResultRenderer(tour, index)
              )}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <div className="font-medium">Aucun voyage trouvé</div>
              <div className="text-sm">
                {query.trim()
                  ? `Aucun résultat pour "${query}"`
                  : "Aucun voyage disponible"}
              </div>
            </div>
          )}

          {/* Indicateur du nombre de résultats */}
          {searchResults.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 text-center">
              {searchResults.length} résultat
              {searchResults.length > 1 ? "s" : ""}
              {query.trim() && ` pour "${query}"`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Hook personnalisé pour la recherche avec debounce
export function useSearchDebounce(value: string, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Composant wrapper pour maintenir la compatibilité avec l'ancien code
export function SearchInput({ tours }: { tours?: Tour[] }) {
  if (!tours) {
    console.warn("SearchInput: tours prop is required for optimal performance");
    return <OptimizedSearchInput tours={[]} />;
  }

  return <OptimizedSearchInput tours={tours} />;
}
