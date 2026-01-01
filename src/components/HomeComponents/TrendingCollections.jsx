import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { TrendingUp, Zap, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useGetNewArrivalsQuery } from "../../redux/services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const TrendingCollections = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("all");
  const [likedItems, setLikedItems] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch new arrivals from API
  const { data: apiData, isLoading, error } = useGetNewArrivalsQuery();

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  // Transform API data to match your ProductCard component - memoized
  const transformApiProduct = useMemo(() => {
    return (product) => {
      // Get primary variant image
      const primaryVariant = product.variants?.[0];
      const primaryImage = primaryVariant?.variantImages?.find(img => img.isPrimary) || primaryVariant?.variantImages?.[0];
      
      // Calculate discount percentage
      const discount = product.offerPrice && product.normalPrice
        ? Math.round(((product.normalPrice - product.offerPrice) / product.normalPrice) * 100)
        : 0;

      return {
        id: product.id,
        name: product.name,
        productCode: product.productCode,
        category: product.category?.name || 'Uncategorized',
        price: `₹${product.offerPrice || product.normalPrice}`,
        originalPrice: product.offerPrice ? `₹${product.normalPrice}` : '',
        discount: discount > 0 ? `${discount}% OFF` : '',
        image: primaryImage?.imageUrl || 'https://via.placeholder.com/300x400',
        isNew: product.isNewArrival,
        isBestSeller: product.isBestSeller,
        featured: product.featured,
        variants: product.variants,
        avgRating: product.avgRating || 0,
        totalRatings: product.totalRatings || 0,
        colors: Array.from(new Set(product.variants?.map(v => v.color) || [])),
        inStock: product.variants?.some(v => v.stock > 0) || false
      };
    };
  }, []);

  // Memoize trending products
  const trendingProducts = useMemo(() => {
    const apiProducts = apiData?.data || [];
    return apiProducts.map(transformApiProduct);
  }, [apiData, transformApiProduct]);

  // Memoize categories
  const categories = useMemo(() => {
    return [
      { id: "all", name: "All Collections", count: trendingProducts.length },
      ...Array.from(new Set(trendingProducts.map(p => p.category)))
        .filter(Boolean)
        .map(category => ({
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category,
          count: trendingProducts.filter(p => p.category === category).length
        }))
    ];
  }, [trendingProducts]);

  // Filter products based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredProducts(trendingProducts);
    } else {
      const selectedCategory = categories.find(cat => cat.id === activeTab);
      if (selectedCategory) {
        setFilteredProducts(
          trendingProducts.filter(product => 
            product.category === selectedCategory.name
          )
        );
      }
    }
    setCurrentPage(0); // Reset to first page on filter change
  }, [activeTab, trendingProducts, categories]);

  const productsToShow = filteredProducts.slice(currentPage * 4, (currentPage + 1) * 4);
  const totalPages = Math.ceil(filteredProducts.length / 4);

  const toggleLike = id => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product) => {
    // Your add to cart logic here
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <section className={`w-full py-16 lg:py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`w-full py-16 lg:py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className={`text-lg ${textSecondary}`}>Failed to load new arrivals. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-16 lg:py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full"
          >
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              NEW ARRIVALS
            </span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}
          >
            Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">Arrivals</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg ${textSecondary} max-w-2xl mx-auto`}
          >
            Discover our latest nightwear collections. Fresh styles added recently!
          </motion.p>
        </div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-10 lg:mb-14"
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg'
                    : `${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm`
                }`}
              >
                {category.name}
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === category.id
                    ? 'bg-white/20'
                    : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {productsToShow.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  liked={!!likedItems[product.id]}
                  onToggleLike={() => toggleLike(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-full ${
                    currentPage === 0
                      ? 'opacity-50 cursor-not-allowed text-gray-400'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <span className={`text-sm ${textSecondary}`}>
                  Page {currentPage + 1} of {totalPages}
                </span>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`p-2 rounded-full ${
                    currentPage === totalPages - 1
                      ? 'opacity-50 cursor-not-allowed text-gray-400'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg ${textSecondary}`}>No new arrivals found.</p>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 lg:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            View All New Arrivals
            <Clock className="w-5 h-5" />
          </motion.button>

          <p className={`text-sm ${textSecondary} mt-4`}>
            {trendingProducts.length}+ new nightwear designs to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingCollections;