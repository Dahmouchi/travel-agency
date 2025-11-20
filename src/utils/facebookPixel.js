// utils/facebookPixel.js

/**
 * Utilitaires pour le tracking d'événements Facebook Pixel
 */

// Vérifier si le pixel Facebook est chargé
export const isFacebookPixelLoaded = () => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

// Fonction générique pour tracker un événement
export const trackEvent = (eventName, parameters = {}) => {
  if (isFacebookPixelLoaded()) {
    window.fbq('track', eventName, parameters);
    console.log(`Facebook Pixel: ${eventName} tracked`, parameters);
  } else {
    console.warn('Facebook Pixel not loaded');
  }
};

// Fonction pour tracker un événement personnalisé
export const trackCustomEvent = (eventName, parameters = {}) => {
  if (isFacebookPixelLoaded()) {
    window.fbq('trackCustom', eventName, parameters);
    console.log(`Facebook Pixel Custom: ${eventName} tracked`, parameters);
  } else {
    console.warn('Facebook Pixel not loaded');
  }
};

// Événements e-commerce prédéfinis
export const trackPurchase = (value, currency = 'EUR', contentIds = []) => {
  trackEvent('Purchase', {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: 'product'
  });
};

export const trackAddToCart = (value, currency = 'EUR', contentId = '', contentName = '') => {
  trackEvent('AddToCart', {
    value: value,
    currency: currency,
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product'
  });
};

export const trackInitiateCheckout = (value, currency = 'EUR', numItems = 1) => {
  trackEvent('InitiateCheckout', {
    value: value,
    currency: currency,
    num_items: numItems,
    content_type: 'product'
  });
};

export const trackViewContent = (contentId = '', contentName = '', contentType = 'product', value = 0, currency = 'EUR') => {
  trackEvent('ViewContent', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: contentType,
    value: value,
    currency: currency
  });
};

export const trackSearch = (searchString, contentType = 'product') => {
  trackEvent('Search', {
    search_string: searchString,
    content_type: contentType
  });
};

// Événements pour les leads
export const trackLead = (value = 0, currency = 'EUR', contentName = '') => {
  trackEvent('Lead', {
    value: value,
    currency: currency,
    content_name: contentName
  });
};

export const trackCompleteRegistration = (status = 'completed', contentName = '') => {
  trackEvent('CompleteRegistration', {
    status: status,
    content_name: contentName
  });
};

// Événements personnalisés pour l'éducation
export const trackCourseView = (courseId, courseName, courseCategory = '') => {
  trackCustomEvent('CourseView', {
    course_id: courseId,
    course_name: courseName,
    course_category: courseCategory
  });
};

export const trackCourseEnrollment = (courseId, courseName, value = 0, currency = 'EUR') => {
  trackCustomEvent('CourseEnrollment', {
    course_id: courseId,
    course_name: courseName,
    value: value,
    currency: currency
  });
};

export const trackLessonComplete = (courseId, lessonId, lessonName = '') => {
  trackCustomEvent('LessonComplete', {
    course_id: courseId,
    lesson_id: lessonId,
    lesson_name: lessonName
  });
};

export const trackQuizComplete = (courseId, quizId, score = 0, maxScore = 100) => {
  trackCustomEvent('QuizComplete', {
    course_id: courseId,
    quiz_id: quizId,
    score: score,
    max_score: maxScore,
    success_rate: (score / maxScore) * 100
  });
};

// Événements pour les voyages/tours
export const trackTourView = (tourId, tourName, destination = '', price = 0) => {
  trackCustomEvent('TourView', {
    tour_id: tourId,
    tour_name: tourName,
    destination: destination,
    value: price,
    currency: 'EUR'
  });
};

export const trackTourBooking = (tourId, tourName, destination = '', price = 0, travelers = 1) => {
  trackCustomEvent('TourBooking', {
    tour_id: tourId,
    tour_name: tourName,
    destination: destination,
    value: price,
    currency: 'EUR',
    num_travelers: travelers
  });
};

export const trackContactForm = (formType = 'contact', source = '') => {
  trackCustomEvent('ContactFormSubmit', {
    form_type: formType,
    source: source
  });
};

// Fonction pour tracker les conversions avec des paramètres personnalisés
export const trackConversion = (conversionName, value = 0, currency = 'EUR', additionalParams = {}) => {
  const params = {
    value: value,
    currency: currency,
    ...additionalParams
  };
  
  trackEvent(conversionName, params);
};

// Hook React pour faciliter l'utilisation
export const useFacebookPixel = () => {
  return {
    trackEvent,
    trackCustomEvent,
    trackPurchase,
    trackAddToCart,
    trackInitiateCheckout,
    trackViewContent,
    trackSearch,
    trackLead,
    trackCompleteRegistration,
    trackCourseView,
    trackCourseEnrollment,
    trackLessonComplete,
    trackQuizComplete,
    trackTourView,
    trackTourBooking,
    trackContactForm,
    trackConversion,
    isLoaded: isFacebookPixelLoaded
  };
};