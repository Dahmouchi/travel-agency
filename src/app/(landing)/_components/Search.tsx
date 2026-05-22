"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, MapPin, Clock, Euro, X, House } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Tour } from "@prisma/client";

// Interface pour définir la structure d'un tour

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
  searchFields = ["title", "description"],
  onSelect,
  className = "",
  debounceMs = 300,
  showImages = false,
  customResultRenderer,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useRouter();

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
        navigate.push(`/voyage/${tour.id}`);
      }
      setShowSuggestions(false);
      setQuery(tour.title);
      setSelectedIndex(-1);
    },
    [onSelect, navigate],
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
            prev < searchResults.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1,
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
    [showSuggestions, searchResults, selectedIndex, handleSelect],
  );

  // Clear search
  const handleClear = useCallback(() => {
    setQuery("");
    setSelectedIndex(-1);
  }, []);

  // Rendu par défaut d'un résultat
  const defaultResultRenderer = useCallback(
    (tour: Tour, index: number) => (
      <li
        key={tour.id}
        onClick={() => handleSelect(tour)}
        onMouseEnter={() => setSelectedIndex(index)}
        className={cn(
          "group relative px-5 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4",
          "hover:bg-suggestion-hover border-l-4 border-transparent",
          selectedIndex === index &&
            "bg-suggestion-selected border-suggestion-border shadow-sm",
        )}
      >
        {showImages && tour.imageUrl && (
          <div className="relative lg:w-16 lg:h-16 w-8 h-8 flex-shrink-0 overflow-hidden rounded-xs lg:rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <img
              src={tour.imageUrl}
              alt={tour.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground truncate text-lg mb-1 group-hover:text-primary transition-colors duration-300">
            {tour.title}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            {tour.type && (
              <div className="flex items-center gap-1.5 text-muted-foreground transition-colors duration-300">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{tour.type}</span>
              </div>
            )}

            {tour.accommodationType && (
              <div className=" hidden lg:flex items-center gap-1.5 text-muted-foreground">
                <House className="w-3.5 h-3.5" />
                <span>{tour.accommodationType}</span>
              </div>
            )}
          </div>
        </div>

        {tour.priceOriginal && (
          <div className="flex-shrink-0 hidden lg:block px-4 py-2 rounded-full bg-[#56DFCF] text-primary-foreground font-bold text-sm shadow-md group-hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-1">
              À partir de <span>{tour.priceOriginal}</span>
              MAD
            </div>
          </div>
        )}
      </li>
    ),
    [selectedIndex, showImages, handleSelect],
  );

  return (
    <div className={cn("relative w-full max-w-4xl zzz ", className)}>
      <div className="relative group">
        {/* Icon de recherche */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 pointer-events-none z-10">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full pl-14 pr-32 py-4 text-base",
            "bg-card text-foreground",
            "border-2 border-border rounded-full",
            "outline-none transition-all duration-300",
            "focus:border-primary focus:shadow-lg focus:shadow-primary/20",
            "placeholder:text-muted-foreground",
            "backdrop-blur-sm",
          )}
          autoComplete="off"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-28 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-muted transition-colors duration-300 z-10"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        <button
          onClick={() => {
            if (query.trim()) {
              navigate.push(`/?search=${encodeURIComponent(query)}`);
            }
          }}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "px-6 py-2.5 rounded-full",
            "bg-[#8EBD22]",
            "text-primary-foreground font-semibold text-sm",
            "shadow-md hover:shadow-xl",
            "hover:scale-105 active:scale-95",
            "transition-all duration-300",
            "flex items-center gap-2",
          )}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Rechercher</span>
        </button>
      </div>

      {/* Dropdown des suggestions */}
      {showSuggestions && (
        <div
          className={cn(
            "absolute mt-3 w-full",
            "bg-card/95 backdrop-blur-xl",
            "border-2 border-border rounded-2xl",
            "shadow-2xl shadow-primary/10",
            "max-h-[28rem] overflow-hidden",
            "animate-slide-up z-50",
          )}
        >
          {searchResults.length > 0 ? (
            <>
              <ul className="overflow-y-auto max-h-96 text-left divide-y divide-border/50">
                {searchResults.map((tour, index) =>
                  customResultRenderer
                    ? customResultRenderer(tour)
                    : defaultResultRenderer(tour, index),
                )}
              </ul>

              {/* Indicateur du nombre de résultats */}
              <div className="px-5 py-3 bg-muted/50 backdrop-blur-sm border-t-2 border-border text-xs text-muted-foreground text-center font-medium">
                {searchResults.length} résultat
                {searchResults.length > 1 ? "s" : ""}
                {query.trim() && (
                  <span className="text-foreground font-semibold">
                    {" "}
                    pour &quot;{query}&quot;
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8EBD22] mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div className="font-semibold text-foreground text-lg mb-2">
                Aucun voyage trouvé
              </div>
              <div className="text-sm text-muted-foreground">
                {query.trim()
                  ? `Aucun résultat pour "${query}"`
                  : "Aucun voyage disponible"}
              </div>
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
