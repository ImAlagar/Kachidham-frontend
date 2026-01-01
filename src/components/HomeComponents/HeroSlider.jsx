import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Crown, Sparkles, Moon, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedIcon from '../../components/Common/AnimatedIcon';
import { HOVER_ANIMATIONS } from '../../constants/animationConstants';
import { useGetActiveSlidersQuery } from '../../redux/services/sliderService';

const HeroSlider = () => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch slider data from API
  const { 
    data: apiResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetActiveSlidersQuery();

  // Extract slides from API response or use fallback
  const slides = apiResponse?.data || [
    {
      id: "fallback-1",
      title: "Luxurious Nights",
      subtitle: "Premium Nightwear Collection",
      description: "Experience ultimate comfort with our silk and satin nightwear, designed for your most peaceful nights.",
      image: "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5a5e?w=1600&auto=format&fit=crop",
      buttonText: "Shop Collection",
      buttonLink: "/shop",
      layout: "left",
      smallText: "New Arrivals",
      offerText: null,
      bgImage: "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5a5e?w=1600&auto=format&fit=crop",
      color: "from-purple-500/20 to-pink-500/20"
    }
  ];

  // Get appropriate icon based on slide content
  const getSlideIcon = (slide) => {
    if (slide.offerText?.includes('🧸')) return Sparkles;
    if (slide.title?.includes('Dream') || slide.title?.includes('Night')) return Moon;
    if (slide.title?.includes('Elegance') || slide.subtitle?.includes('Designer')) return Crown;
    return Zap;
  };

  // Get appropriate color gradient based on slide
  const getSlideColor = (slide, index) => {
    if (slide.layout === 'right') return "from-blue-500/20 to-purple-500/20";
    if (slide.layout === 'left') return "from-purple-500/20 to-pink-500/20";
    
    // Fallback gradients based on index
    const colors = [
      "from-purple-500/20 to-pink-500/20",
      "from-blue-500/20 to-purple-500/20",
      "from-pink-500/20 to-rose-500/20",
      "from-amber-500/20 to-orange-500/20",
      "from-emerald-500/20 to-teal-500/20"
    ];
    return colors[index % colors.length];
  };

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigation functions
  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  // Handle button click with navigation
  const handleButtonClick = (link) => {
    if (link) {
      window.location.href = link;
    }
  };

  // Theme-based styles
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const buttonGradient = 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600';

  // Responsive height based on screen size
  const getSliderHeight = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 'h-[75vh] md:h-[70vh]'; // Mobile
      if (width < 1024) return 'h-[70vh] md:h-[65vh]'; // Tablet
      return 'h-[85vh]'; // Desktop
    }
    return 'h-[75vh] sm:h-[70vh] md:h-[65vh] lg:h-[85vh]';
  };

  // Responsive image sizing
  const getImageSize = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 'w-48 h-56';
      if (width < 768) return 'w-56 h-64';
      if (width < 1024) return 'w-60 h-68';
      return 'w-64 h-72';
    }
    return 'w-48 h-56 sm:w-56 sm:h-64 md:w-60 md:h-68 lg:w-64 lg:h-72';
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className={`relative ${getSliderHeight()} overflow-hidden flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-t-2 border-b-2 border-purple-500"></div>
      </section>
    );
  }

  // Show error state
  if (isError) {
    console.error('Error fetching slider data:', error);
    return (
      <section className={`relative ${getSliderHeight()} overflow-hidden flex items-center justify-center`}>
        <div className="text-center px-4">
          <p className="text-red-500 text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">Failed to load slider content</p>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base">Using fallback content</p>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!slides || slides.length === 0) {
    return (
      <section className={`relative ${getSliderHeight()} overflow-hidden flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-500 text-sm sm:text-base md:text-lg">No sliders available</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative ${getSliderHeight()} overflow-hidden`}>
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id || `slide-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: slide.bgImage 
                    ? `url(${slide.bgImage})`
                    : slide.image 
                      ? `url(${slide.image})`
                      : 'none'
                }}
              >
                {/* Color overlay based on slide */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getSlideColor(slide, index)}`}></div>
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              {/* Content Container */}
<div className="relative h-full flex items-center">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">

    {/* MAIN FLEX — MOBILE: COLUMN (IMAGE TOP), DESKTOP: YOUR ORIGINAL ORDER */}
    <div
      className={`
        flex flex-col 
        ${slide.layout === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}
        items-center justify-between 
        gap-6 sm:gap-8 md:gap-10 lg:gap-12
      `}
    >

      {/* ------------ IMAGE FIRST ON MOBILE ------------ */}
      {slide.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          
          /* MOBILE = ORDER 1 (IMAGE TOP)  
             DESKTOP = ORDER BASED ON layout */
          className={`
            w-full sm:w-auto lg:w-1/2
            flex justify-center
            mt-4 sm:mt-0

            ${slide.layout === 'right' ? 'lg:order-first' : 'lg:order-last'}
            order-1
          `}
        >
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl">
              <img
                src={slide.image}
                alt={slide.title || 'Product'}
                className={`${getImageSize()} object-cover`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            {/* Decorations */}
            <div className="hidden sm:block absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="hidden sm:block absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-pink-500/10 rounded-full blur-xl"></div>

            {/* Optional badge */}
            {slide.offerText && (
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full shadow-lg">
                <span className="font-bold text-xs sm:text-sm">NEW</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ------------ TEXT SECOND ON MOBILE ------------ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}

        /* MOBILE = ORDER 2 (CONTENT BOTTOM)
           DESKTOP = YOUR NORMAL ORDER */
        className={`
          w-full
          order-2
          ${slide.layout === 'right' 
            ? 'lg:w-1/2 lg:text-right lg:pl-8 xl:pl-12' 
            : 'lg:w-1/2 lg:pr-8 xl:pr-12'}
          text-center lg:text-left 
          px-2 sm:px-4 md:px-6
        `}
      >

        {/* Small text */}
        {slide.smallText && (
          <div
            className={`flex items-center gap-2 mb-3 sm:mb-4 ${
              slide.layout === 'right'
                ? 'lg:justify-end'
                : 'justify-center lg:justify-start'
            }`}
          >
            <AnimatedIcon
              icon={getSlideIcon(slide)}
              animation="pulse"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-400"
            />
            <span className="text-xs sm:text-sm md:text-base font-medium text-amber-400 tracking-wider">
              {slide.smallText}
            </span>
          </div>
        )}

        {/* Offer text */}
        {slide.offerText && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full mb-4 sm:mb-5 md:mb-6 ${
              slide.layout === 'right' ? 'lg:text-right' : ''
            }`}
          >
            <span className="font-bold text-xs sm:text-sm md:text-base">{slide.offerText}</span>
          </motion.div>
        )}

        {/* Title */}
        <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold ${textPrimary} mb-3 sm:mb-4 leading-tight`}>
          {slide.title}
        </h1>

        {/* Subtitle */}
        {slide.subtitle && (
          <p
            className={`text-sm sm:text-base md:text-lg lg:text-xl ${textSecondary} mb-3 sm:mb-4 max-w-xs sm:max-w-sm md:max-w-xl mx-auto lg:mx-0 ${
              slide.layout === 'right' ? 'lg:ml-auto' : ''
            }`}
          >
            {slide.subtitle}
          </p>
        )}

        {/* Description */}
        {slide.description && (
          <p
            className={`hidden sm:block text-xs sm:text-sm md:text-base lg:text-lg ${textSecondary} mb-4 sm:mb-5 md:mb-6 max-w-xs sm:max-w-sm md:max-w-lg mx-auto lg:mx-0 ${
              slide.layout === 'right' ? 'lg:ml-auto' : ''
            }`}
          >
            {slide.description}
          </p>
        )}

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${
            slide.layout === 'right'
              ? 'lg:justify-end'
              : 'justify-center lg:justify-start'
          }`}
        >
          {slide.buttonText && (
            <motion.button
              whileHover={HOVER_ANIMATIONS.button}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick(slide.buttonLink)}
              className={`px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 lg:px-7 lg:py-3.5 ${buttonGradient} text-white rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 min-w-[140px] sm:min-w-[160px]`}
            >
              {slide.buttonText}
              <ArrowRight size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  </div>
</div>

            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Dots indicator - Responsive positioning and sizing */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-6 sm:w-8 md:w-10' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation arrows - Responsive sizing and positioning */}
      {slides.length > 1 && (
        <>
          {/* Mobile: Smaller buttons at bottom corners */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 sm:hidden rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 sm:hidden rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>

          {/* Tablet & Desktop: Larger buttons at sides */}
          <button
            onClick={prevSlide}
            className="hidden sm:block absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden sm:block absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Slide counter - Show on tablet and desktop */}
      {slides.length > 1 && (
        <div className="hidden sm:block absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 text-white/70 text-xs sm:text-sm md:text-base">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;