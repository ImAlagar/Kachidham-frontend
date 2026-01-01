import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import banner from "../../assets/bannerImages/banner.jpg"
import { Link } from "react-router-dom";

const CollectionsBanner = () => {
  const { theme } = useTheme();
  
  const bgImage = banner; // You can replace this with your own image

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Luxury Nightwear Collection" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        
        {/* Badge/Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-white font-medium tracking-wider">THE LUDNS</span>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight"
        >
          ALL COLLECTIONS
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light"
        >
          Curated with love, crafted for you.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <a 
            href="/shop" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px -15px rgba(245, 158, 11, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-amber-500 to-amber-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-xl overflow-hidden"
            >
              {/* Button shine effect */}
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              
              {/* Button content */}
              <span className="flex items-center gap-3 relative z-10">
                <Link to={'/shop'}>SHOP NOW</Link>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.button>
          </a>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex justify-center items-center gap-6"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          <Heart className="w-5 h-5 text-amber-300 animate-pulse" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </motion.div>

        {/* URL Display (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <a 
            href="http://theludns.in/collections" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white text-sm md:text-base font-medium transition-colors inline-flex items-center gap-2"
          >
            <span className="text-amber-300">→</span>
            http://theludns.in/collections
          </a>
        </motion.div>

      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
    </section>
  );
};

export default CollectionsBanner;