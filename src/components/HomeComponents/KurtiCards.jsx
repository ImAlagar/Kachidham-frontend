import React from "react";
import { motion } from "framer-motion";
import { Moon, Star, Sparkles, Crown, Bed } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import AnimatedIcon from "../../components/Common/AnimatedIcon";

import SatinRobeSet from "../../assets/categories/SatinRobeSet.jpg";
import NightSuits1 from "../../assets/categories/NightSuits1.webp";
import FleeceNightSuit from "../../assets/categories/FleeceNightSuit.jpg";
import LongNighty from "../../assets/categories/LongNighty.jpg";

const KurtiCards = () => {
  const { theme } = useTheme();
  
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgColor = theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/80';
  const shadow = theme === 'dark' ? 'shadow-lg shadow-purple-900/20' : 'shadow-xl';

  const cards = [
    {
      title: "SILK NIGHTGOWNS",
      img: SatinRobeSet,
      rotate: -5,
      borderColor: "border-purple-300 dark:border-purple-700",
      gradient: "from-purple-500/10 to-pink-500/10",
      icon: Moon,
      iconColor: "text-purple-500",
      animation: "float"
    },
    {
      title: "SLEEPWEAR SETS",
      img: NightSuits1,
      rotate: 3,
      borderColor: "border-blue-300 dark:border-blue-700",
      gradient: "from-blue-500/10 to-indigo-500/10",
      icon: Bed,
      iconColor: "text-blue-500",
      animation: "pulse"
    },
    {
      title: "FLEECE PAJAMAS",
      img: FleeceNightSuit,
      rotate: -4,
      borderColor: "border-amber-300 dark:border-amber-700",
      gradient: "from-amber-500/10 to-orange-500/10",
      icon: Sparkles,
      iconColor: "text-amber-500",
      animation: "glow"
    },
    {
      title: "LONG NIGHTIES",
      img: LongNighty,
      rotate: 5,
      borderColor: "border-pink-300 dark:border-pink-700",
      gradient: "from-pink-500/10 to-rose-500/10",
      icon: Crown,
      iconColor: "text-pink-500",
      animation: "shimmer"
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="w-full py-16 lg:py-20 bg-gradient-to-b from-white/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/10">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="mb-4">
            <span className="text-sm font-medium text-purple-500 dark:text-purple-400 tracking-wider">
              DREAM COLLECTIONS
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}>
            Dream in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Luxury
            </span>
          </h2>
          
          <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
            Discover our curated collection of premium nightwear designed for ultimate comfort and elegance
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-8 lg:gap-12 px-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ 
                rotate: 0, 
                scale: 1.03,
                y: -10,
                transition: { duration: 0.3 }
              }}
              style={{ rotate: card.rotate }}
              className="relative group cursor-pointer "
            >
              {/* Single Border */}
              <div className={`absolute -inset-1 rounded-2xl border-2 ${card.borderColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Main Card */}
              <div className={`relative rounded-xl ${bgColor} backdrop-blur-sm ${shadow} overflow-hidden border border-white/20`}>
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-[350px] object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4">
                    <AnimatedIcon 
                      icon={card.icon}
                      animation={card.animation}
                      className={`w-8 h-8 ${card.iconColor} bg-white/80 dark:bg-gray-800/80 p-2 rounded-full`}
                    />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-bold text-gray-800 dark:text-gray-200 rounded-full uppercase tracking-wider">
                      Premium
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>
                    {card.title}
                  </h3>
                  
                  <p className={`text-sm ${textSecondary} mb-4`}>
                    {card.subtitle}
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg bg-gradient-to-r ${card.borderColor.replace('border-', 'from-').replace('-300', '-500').replace('-700', '-600')} ${card.borderColor.replace('border-', 'to-').replace('-300', '-400').replace('-700', '-500')} text-white font-semibold text-sm`}
                  >
                    Explore Collection
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 lg:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            View All Collections
          </motion.button>
          
          <p className={`text-sm ${textSecondary} mt-4`}>
            Over 100+ premium nightwear designs to choose from
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default KurtiCards;