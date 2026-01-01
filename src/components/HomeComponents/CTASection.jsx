import React from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AnimatedIcon from '../../components/Common/AnimatedIcon';
import { PAGE_TRANSITIONS } from '../../constants/animationConstants';

const CTASection = () => {
  const { theme } = useTheme();
  
  // Theme-aware colors
  const bgGradient = theme === 'dark' 
    ? 'bg-gradient-to-r from-purple-700 to-pink-600'
    : 'bg-gradient-to-r from-purple-600 to-pink-500';
  
  const textColor = 'text-white'; // Always white on gradient background
  const textMuted = 'text-white/90';
  const buttonPrimary = 'bg-white text-purple-600 hover:bg-gray-100';
  const buttonSecondary = 'border-2 border-white text-white hover:bg-white/10';

  return (
    <section className={`py-16 lg:py-24 ${bgGradient}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={PAGE_TRANSITIONS.container}
          className="text-center"
        >
          <motion.div variants={PAGE_TRANSITIONS.item} className="inline-block mb-4">
            <AnimatedIcon 
              icon={Moon}
              animation="float"
              className="w-16 h-16 text-white"
            />
          </motion.div>
          
          <motion.h2 variants={PAGE_TRANSITIONS.item} className={`text-3xl md:text-5xl font-bold ${textColor} mb-4`}>
            Transform Your Nights
          </motion.h2>
          
          <motion.p variants={PAGE_TRANSITIONS.item} className={`text-xl ${textMuted} max-w-2xl mx-auto mb-8`}>
            Experience the perfect blend of comfort and elegance. Your dream nightwear awaits.
          </motion.p>

          <motion.div variants={PAGE_TRANSITIONS.item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-colors ${buttonPrimary}`}
              >
                Shop Now
              </motion.button>
            </Link>
            
            <Link to="/about-us">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-colors ${buttonSecondary}`}
              >
                Our Story
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;