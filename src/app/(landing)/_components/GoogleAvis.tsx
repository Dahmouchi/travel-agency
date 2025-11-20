/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  ExternalLink,
  Filter,
  Calendar,
  Quote,
  MapPin,
  ThumbsUp
} from 'lucide-react';

// Données d'exemple des avis Google
const sampleGoogleReviews = [
  {
    id: 1,
    author: "Sarah Martin",
    avatar: "/avatars/sarah.jpg", // Remplacez par vos vraies images
    rating: 5,
    date: "2024-01-15",
    text: "Expérience absolument fantastique ! L'équipe de Happy Trip a organisé un voyage parfait au Maroc. Le guide était exceptionnel, les hébergements de qualité et les paysages à couper le souffle. Je recommande vivement !",
    verified: true,
    helpful: 12,
    location: "Paris, France"
  },
  {
    id: 2,
    author: "Ahmed Benali",
    avatar: "/avatars/ahmed.jpg",
    rating: 5,
    date: "2024-01-10",
    text: "Service client remarquable et attention aux détails impressionnante. Notre voyage dans l'Atlas a dépassé toutes nos attentes. Merci pour cette aventure inoubliable !",
    verified: true,
    helpful: 8,
    location: "Casablanca, Maroc"
  },
  {
    id: 3,
    author: "Marie Dubois",
    avatar: "/avatars/marie.jpg",
    rating: 5,
    date: "2024-01-05",
    text: "Une agence de voyage exceptionnelle ! Professionnalisme, réactivité et passion pour leur métier. Le circuit dans le désert était magique. À refaire sans hésitation !",
    verified: true,
    helpful: 15,
    location: "Lyon, France"
  },
  {
    id: 4,
    author: "David Wilson",
    avatar: "/avatars/david.jpg",
    rating: 4,
    date: "2023-12-28",
    text: "Très belle expérience globale. L'organisation était parfaite et les guides très compétents. Seul petit bémol : le trajet un peu long, mais ça vaut vraiment le coup !",
    verified: true,
    helpful: 6,
    location: "Londres, UK"
  },
  {
    id: 5,
    author: "Fatima El Mansouri",
    avatar: "/avatars/fatima.jpg",
    rating: 5,
    date: "2023-12-20",
    text: "Happy Trip a rendu notre lune de miel absolument parfaite ! Attention personnalisée, lieux magnifiques et souvenirs inoubliables. Merci infiniment !",
    verified: true,
    helpful: 20,
    location: "Rabat, Maroc"
  },
  {
    id: 6,
    author: "Jean-Pierre Moreau",
    avatar: "/avatars/jean.jpg",
    rating: 5,
    date: "2023-12-15",
    text: "Première expérience avec Happy Trip et certainement pas la dernière ! Équipe professionnelle, circuits bien pensés et rapport qualité-prix excellent.",
    verified: true,
    helpful: 9,
    location: "Marseille, France"
  }
];

// Composant principal des avis Google
const GoogleReviewsSection = ({ 
  reviews = sampleGoogleReviews,
  businessName = "Happy Trip",
  averageRating = 4.8,
  totalReviews = 127,
  googleBusinessUrl = "https://g.page/happy-trip-maroc"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [selectedRating, setSelectedRating] = useState('all');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play du carrousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev === filteredReviews.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredReviews.length, isAutoPlaying]);

  // Filtrage par note
  const handleRatingFilter = (rating:any) => {
    setSelectedRating(rating);
    if (rating === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === parseInt(rating)));
    }
    setCurrentIndex(0);
  };

  // Navigation du carrousel
  const nextReview = () => {
    setCurrentIndex((prev) => 
      prev === filteredReviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? filteredReviews.length - 1 : prev - 1
    );
  };

  // Formatage de la date
  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Rendu des étoiles
  const renderStars = (rating:any, size = "w-5 h-5") => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.section 
      className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* En-tête de la section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" 
              alt="Google" 
              className="w-8 h-8 mr-3"
              
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Avis Google
            </h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-6">
            Découvrez ce que nos clients disent de leurs expériences avec {businessName}
          </p>

          {/* Statistiques globales */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {renderStars(Math.floor(averageRating), "w-6 h-6")}
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  {averageRating}
                </span>
              </div>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
            
            <div className="w-px h-12 bg-gray-300"></div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {totalReviews}+
              </div>
              <p className="text-sm text-gray-600">Avis clients</p>
            </div>
            
            <div className="w-px h-12 bg-gray-300"></div>
            
            <motion.a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">Voir sur Google</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-2 bg-white rounded-full shadow-md p-2">
            <Filter className="w-4 h-4 text-gray-500 ml-2" />
            <button
              onClick={() => handleRatingFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedRating === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tous
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingFilter(rating.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                  selectedRating === rating.toString()
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Carrousel des avis */}
        <motion.div 
          className="relative"
          variants={itemVariants}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {filteredReviews.length > 0 && (
                  <div className="max-w-4xl mx-auto">
                    {/* En-tête de l'avis */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={filteredReviews[currentIndex].avatar}
                            alt={filteredReviews[currentIndex].author}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                           
                          />
                          {filteredReviews[currentIndex].verified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <Shield className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {filteredReviews[currentIndex].author}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{filteredReviews[currentIndex].location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-2">
                          {renderStars(filteredReviews[currentIndex].rating)}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(filteredReviews[currentIndex].date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenu de l'avis */}
                    <div className="relative mb-6">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200" />
                      <p className="text-lg text-gray-700 leading-relaxed pl-6 italic">
                        &quot;{filteredReviews[currentIndex].text}&quot;
                      </p>
                    </div>

                    {/* Pied de l'avis */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        {filteredReviews[currentIndex].verified && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Avis vérifié</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1 text-gray-500">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">
                            {filteredReviews[currentIndex].helpful} personnes ont trouvé cet avis utile
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        {currentIndex + 1} / {filteredReviews.length}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Contrôles de navigation */}
          {filteredReviews.length > 1 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Avis précédent"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <button
                onClick={nextReview}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Avis suivant"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Indicateurs de pagination */}
          {filteredReviews.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {filteredReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Aller à l'avis ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Appel à l'action */}
        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous avez voyagé avec nous ?
            </h3>
            <p className="text-gray-600 mb-6">
              Partagez votre expérience et aidez d&apos;autres voyageurs à découvrir nos services
            </p>
            <motion.a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-5 h-5" />
              <span>Laisser un avis</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GoogleReviewsSection;
export { sampleGoogleReviews };