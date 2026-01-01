import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { PAGE_TRANSITIONS, HOVER_ANIMATIONS } from '../../constants/animationConstants';

const CollectionsSection = () => {
  const { theme } = useTheme();

  const collections = [
    {
      id: 1,
      title: "Silk Nightgowns",
      price: "From ₹2,499",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop",
      category: "Premium"
    },
    {
      id: 2,
      title: "Lace Chemises",
      price: "From ₹1,899",
      image: "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5a5e?w=800&auto=format&fit=crop",
      category: "Elegant"
    },
    {
      id: 3,
      title: "Cotton Pajamas",
      price: "From ₹1,299",
      image: "https://images.unsplash.com/photo-157790609642-9c35bd6360cc?w=800&auto=format&fit=crop",
      category: "Comfort"
    },
    {
      id: 4,
      title: "Satin Robes",
      price: "From ₹3,499",
      image: "https://images.unsplash.com/photo-1594736797933-d0b64ada5d79?w=800&auto=format&fit=crop",
      category: "Luxury"
    }
  ];

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const buttonGradient = 'bg-gradient-to-r from-purple-600 to-pink-500';
  const bgGradient = theme === 'dark' 
    ? 'bg-gradient-to-r from-gray-900/50 to-gray-800/50' 
    : 'bg-gradient-to-r from-purple-50/50 to-pink-50/50';

  return (
    <section className="py-16 lg:py-24" style={{ background: bgGradient }}>
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={PAGE_TRANSITIONS.container}
          className="text-center mb-12"
        >
          <motion.h2 variants={PAGE_TRANSITIONS.item} className={`text-3xl md:text-4xl font-bold ${textPrimary} mb-4`}>
            Featured Collections
          </motion.h2>
          <motion.p variants={PAGE_TRANSITIONS.item} className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
            Discover our curated selection of premium nightwear
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={PAGE_TRANSITIONS.item}
              whileHover={HOVER_ANIMATIONS.card}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="aspect-square bg-gray-200 dark:bg-gray-700"
                >
                  <img 
                    src={collection.image} 
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sm font-medium rounded-full">
                    {collection.category}
                  </span>
                </div>
              </div>
              <div>
                <h3 className={`font-semibold ${textPrimary} mb-1`}>
                  {collection.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                    {collection.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-500"
                  >
                    <Heart size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={PAGE_TRANSITIONS.item}
          className="text-center mt-12"
        >
          <Link to="/shop">
            <motion.button
              whileHover={HOVER_ANIMATIONS.button}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 ${buttonGradient} text-white rounded-full font-semibold text-lg flex items-center gap-2 mx-auto`}
            >
              View All Collections
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionsSection;