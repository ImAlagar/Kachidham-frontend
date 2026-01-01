import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Heart, Package } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedIcon from '../../components/Common/AnimatedIcon';
import { PAGE_TRANSITIONS, HOVER_ANIMATIONS } from '../../constants/animationConstants';

const FeaturesSection = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Finest fabrics with meticulous craftsmanship",
      animation: "pulse"
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free shipping on orders above ₹1,999",
      animation: "heartbeat"
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every piece crafted with care and attention",
      animation: "float"
    },
    {
      icon: Package,
      title: "Easy Returns",
      description: "30-day return policy for your peace of mind",
      animation: "shimmer"
    }
  ];

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const accentColor = 'text-purple-500 dark:text-purple-400';

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={PAGE_TRANSITIONS.container}
          className="text-center mb-12"
        >
          <motion.div variants={PAGE_TRANSITIONS.item} className="inline-block mb-4">
            <AnimatedIcon 
              icon={Shield}
              animation="glow"
              className="w-12 h-12 text-purple-500"
            />
          </motion.div>
          
          <motion.h2 variants={PAGE_TRANSITIONS.item} className={`text-3xl md:text-4xl font-bold ${textPrimary} mb-4`}>
            Why Choose kachidham Fashions
          </motion.h2>
          
          <motion.p variants={PAGE_TRANSITIONS.item} className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
            Experience the difference with our commitment to quality, comfort, and elegance
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={PAGE_TRANSITIONS.item}
              whileHover={HOVER_ANIMATIONS.card}
              className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}
            >
              <div className="mb-4">
                <AnimatedIcon 
                  icon={feature.icon}
                  animation={feature.animation}
                  className={`w-12 h-12 ${accentColor} mx-auto`}
                />
              </div>
              <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
                {feature.title}
              </h3>
              <p className={textSecondary}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;