import React from 'react';
import { Check, Star, ChevronRightCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductTabs = ({ product, activeTab, setActiveTab, availableSizes }) => {
  const totalRatings = product.totalRatings || 0;
  const avgRating = product.avgRating || 0;

  return (
    <div className="mb-12 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-6 py-4 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && ` (${totalRatings})`}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'description' && (
          <DescriptionTab product={product} />
        )}
        {activeTab === 'specifications' && (
          <SpecificationsTab product={product} availableSizes={availableSizes} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab 
            totalRatings={totalRatings} 
            avgRating={avgRating} 
            productId={product._id || product.id}
          />
        )}
      </div>
    </div>
  );
};

const DescriptionTab = ({ product }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      About this product
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {product.fullDescription || product.description || 'No description available.'}
    </p>
    <ul className="mt-4 space-y-2">
      {[
        'Premium quality fabric for ultimate comfort',
        'Breathable material for all-night comfort',
        'Easy care - machine washable',
        'Perfect fit with adjustable features'
      ].map((feature, index) => (
        <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SpecificationsTab = ({ product, availableSizes }) => {
  // Helper function to safely render any value
  const renderSpecValue = (value) => {
    if (!value) return '-';
    
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'object') {
      // If it has a name property, use it
      if (value.name) return value.name;
      // If it has a title property, use it
      if (value.title) return value.title;
      // If it's an array, join with commas
      if (Array.isArray(value)) {
        return value.map(item => 
          typeof item === 'object' ? item.name || item.title || 'N/A' : item
        ).join(', ');
      }
      // Otherwise, stringify safely
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    
    return String(value);
  };

  // Get specifications from product - handle both specifications and productDetails
  const productDetails = product?.productDetails || [];
  const variants = product?.variants || [];
  
  // Extract fabric/material info from description or variants
  const getMaterialInfo = () => {
    // Check if material is explicitly provided
    if (product.material) return product.material;
    
    // Try to extract from description
    const description = product.description || '';
    const materialKeywords = ['cotton', 'polyester', 'silk', 'linen', 'wool', 'nylon', 'spandex', 'viscose'];
    
    for (const keyword of materialKeywords) {
      if (description.toLowerCase().includes(keyword)) {
        return `100% ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
      }
    }
    
    return '100% Cotton'; // Default fallback
  };

  // Get care instructions
  const getCareInstructions = () => {
    if (product.careInstructions) return product.careInstructions;
    
    // Try to extract from description
    const description = product.description || '';
    const careKeywords = ['machine wash', 'hand wash', 'dry clean', 'iron', 'tumble dry'];
    
    for (const keyword of careKeywords) {
      if (description.toLowerCase().includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    
    return 'Machine Wash'; // Default fallback
  };

  // Get unique colors from variants
  const availableColors = [...new Set(variants.map(v => v?.color).filter(Boolean))];

  return (
    <div>
      {/* Static specifications with dynamic data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Material & Care</h4>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 text-gray-600 dark:text-gray-400">Material</td>
                <td className="py-2 text-gray-900 dark:text-white font-medium">
                  {getMaterialInfo()}
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 text-gray-600 dark:text-gray-400">Care Instructions</td>
                <td className="py-2 text-gray-900 dark:text-white font-medium">
                  {getCareInstructions()}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600 dark:text-gray-400">Fit</td>
                <td className="py-2 text-gray-900 dark:text-white font-medium">
                  {product.fit || 'Regular Fit'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Product Details</h4>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 text-gray-600 dark:text-gray-400">Product Code</td>
                <td className="py-2 text-gray-900 dark:text-white font-medium">
                  {product.productCode || 'N/A'}
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 text-gray-600 dark:text-gray-400">Category</td>
                <td className="py-2 text-gray-900 dark:text-white font-medium">
                  {renderSpecValue(product.category)}
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 text-gray-600 dark:text-gray-400">Available Colors</td>
                <td className="py-2 text-gray-900 dark:text-white font-medium">
                  {availableColors.length > 0 ? availableColors.join(', ') : 'Single Color'}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600 dark:text-gray-400">Available Sizes</td>
                <td className="py-2 text-gray-900 dark:text-white font-medium">
                  {availableSizes.length > 0 ? availableSizes.join(', ') : 'One Size'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic product details from API */}
      {productDetails.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Product Specifications</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <tbody>
                {productDetails.map((detail, index) => (
                  <tr 
                    key={detail.id || index} 
                    className={`border-b border-gray-200 dark:border-gray-700 ${
                      index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {detail.title || detail.name || `Detail ${index + 1}`}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {renderSpecValue(detail.description)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Additional product info from variants */}
      {variants.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Variant Information</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Color</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Size</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr 
                    key={variant.id || index} 
                    className={`border-b border-gray-200 dark:border-gray-700 ${
                      index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {variant.color || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {variant.size || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <span className={`font-medium ${
                        variant.stock > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {variant.stock > 0 ? `${variant.stock} available` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {variant.sku || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 


const ReviewsTab = ({ totalRatings, avgRating, productId }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {avgRating.toFixed(1)}
          <span className="text-lg font-normal ml-1">/5</span>
        </h3>
        <div className="flex items-center mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= Math.floor(avgRating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:col-span-2">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Rating Distribution</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center">
              <div className="flex items-center w-16">
                <span className="text-sm mr-2 text-gray-600 dark:text-gray-400">{star}</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-3">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${Math.random() * 100}%` }}
                />
              </div>
              <span className="text-sm w-10 text-gray-500 dark:text-gray-400">
                {Math.round(totalRatings * 0.2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Share Your Experience
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            Help other customers by sharing your thoughts about this product
          </p>
        </div>
        <Link
          to={`/product/${productId}/reviews`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Write a Review</span>
          <ChevronRightCircle className="w-5 h-5" />
        </Link>
      </div>
    </div>

    <div className="text-center">
      <Link
        to={`/product/${productId}/reviews`}
        className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <span>View All Reviews</span>
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

export default ProductTabs;