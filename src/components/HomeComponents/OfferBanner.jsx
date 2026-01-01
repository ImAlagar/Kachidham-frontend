import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

import LeftModel from "../../assets/bannerImages/right-model.webp";
import RightModel from "../../assets/bannerImages/left-model.jpg";
import { Link } from "react-router-dom";

const OfferBanner = () => {
  return (
    <section className="relative w-full py-10 md:py-16 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      
      {/* Mobile: Single centered image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:hidden flex justify-center mb-6"
      >
        <img
          src={LeftModel}
          alt="Premium Nightwear"
          className="w-[220px] sm:w-[250px] object-contain rounded-2xl shadow-lg"
          loading="lazy"
        />
      </motion.div>

      {/* Desktop: Left Image - Top */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:block absolute left-0 top-0 md:w-[280px] lg:w-[320px] xl:w-[350px]"
      >
        <img
          src={LeftModel}
          alt="Left Model"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </motion.div>

      {/* Desktop: Right Image - Bottom */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:block absolute right-0 bottom-0 md:w-[260px] lg:w-[300px] xl:w-[330px]"
      >
        <img
          src={RightModel}
          alt="Right Model"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </motion.div>

      {/* CENTER CONTENT - Responsive */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800/50"
        >
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Luxury Nightwear Collection
          </span>
        </motion.div>

        {/* Heading - Responsive */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 dark:text-gray-100 mb-4"
        >
          <span className="font-serif italic">Sleep in</span>{" "}
          <span className="font-bold tracking-tight">Luxury</span>
        </motion.h1>

        {/* Subtext - Responsive */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
        >
          Discover our premium collection of nightwear crafted for ultimate comfort 
          and elegant relaxation.
        </motion.p>

        {/* Features - Responsive grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 mb-10"
        >
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-2 h-2 bg-amber-600 dark:bg-amber-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Premium Fabrics</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-2 h-2 bg-amber-600 dark:bg-amber-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Breathable Materials</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-2 h-2 bg-amber-600 dark:bg-amber-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Elegant Designs</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Heart className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Comfort Guaranteed</span>
          </div>
        </motion.div>

        {/* Button - Responsive */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="group relative bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link to="/shop" className="flex items-center gap-2">
            Explore Collections
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.button>

        {/* Shipping Info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-gray-500 dark:text-gray-400 mt-6"
        >
          Free shipping on orders above ₹1999
        </motion.p>
      </div>

      {/* Mobile: Bottom Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:hidden flex justify-center mt-10"
      >
        <img
          src={RightModel}
          alt="Nightwear Model"
          className="w-[200px] sm:w-[230px] object-contain rounded-2xl shadow-lg"
          loading="lazy"
        />
      </motion.div>

    </section>
  );
};

export default OfferBanner;