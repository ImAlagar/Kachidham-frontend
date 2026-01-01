import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const ProductImages = ({
  product,
  variants,
  selectedImageIndex,
  setSelectedImageIndex,
  showZoomModal,
  setShowZoomModal,
  zoomedImage,
  setZoomedImage,
  isInStock,
  discount
}) => {
  // Extract UNIQUE images from variants
  const getUniqueImages = () => {
    const uniqueImages = new Map(); // Using Map to track unique images by URL
    
    // Process all variants
    variants.forEach(variant => {
      if (variant?.variantImages?.length) {
        variant.variantImages.forEach(img => {
          const imageUrl = img?.imageUrl || img;
          if (imageUrl && !uniqueImages.has(imageUrl)) {
            uniqueImages.set(imageUrl, {
              id: uniqueImages.size, // Use size as ID to maintain order
              imageUrl,
              color: img?.color || variant?.color || 'Default',
              isPrimary: img?.isPrimary || false,
              variantId: variant.id,
              size: variant.size
            });
          }
        });
      }
    });

    // Convert to array
    let images = Array.from(uniqueImages.values());
    
    // Fallback to product image if no variant images
    if (images.length === 0) {
      const productImageUrl = getProductImageUrl(product);
      if (productImageUrl) {
        images = [{
          id: 0,
          imageUrl: productImageUrl,
          color: 'Default',
          isPrimary: true
        }];
      }
    }

    // Sort: primary images first
    images.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    
    return images;
  };

  // Helper to get product image URL
  const getProductImageUrl = (product) => {
    if (!product) return '';
    
    if (product.image) {
      return typeof product.image === 'string' 
        ? product.image 
        : product.image?.url || product.image?.imageUrl;
    }
    
    if (product.images?.length) {
      return product.images[0];
    }
    
    return '';
  };

  // Group images by color for display
  const getImagesByColor = (images) => {
    const groups = {};
    images.forEach(img => {
      const color = img.color || 'Default';
      if (!groups[color]) {
        groups[color] = [];
      }
      groups[color].push(img);
    });
    return groups;
  };

  const images = getUniqueImages();
  const imagesByColor = getImagesByColor(images);
  const mainProductImage = images[selectedImageIndex]?.imageUrl || '';

  const handleImageZoom = (image) => {
    setZoomedImage(image);
    setShowZoomModal(true);
  };

  // Function to get color display name
  const getColorName = (color) => {
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Desktop: Vertical Thumbnails + Main Image */}
      <div className="hidden lg:flex flex-row space-x-4 lg:space-x-6">
        {/* Vertical Thumbnails */}
        <div className="flex flex-col space-y-3 lg:space-y-4 overflow-y-auto pb-2 max-h-80 xl:max-h-96 pr-1">
          {/* Show color groups if multiple colors */}
          {Object.keys(imagesByColor).length > 1 ? (
            Object.entries(imagesByColor).map(([color, colorImages]) => (
              <div key={color} className="space-y-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {getColorName(color)}
                </span>
                <div className="space-y-2">
                  {colorImages.map((image, index) => (
                    <button
                      key={`${color}-${index}`}
                      onClick={() => {
                        const globalIndex = images.findIndex(img => img.imageUrl === image.imageUrl);
                        setSelectedImageIndex(globalIndex);
                      }}
                      className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === images.findIndex(img => img.imageUrl === image.imageUrl)
                          ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${product.name} - ${color}`}
                        className="w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                        }}
                      />
                      {image.isPrimary && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Single color or no color grouping needed
            images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImageIndex === index
                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={`${product.name} ${index + 1}`}
                  className="w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                  }}
                />
                {selectedImageIndex === index && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg"></div>
                )}
                {image.isPrimary && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Main Image */}
        <div className="flex-1">
          <div 
            className="relative rounded-lg overflow-hidden cursor-zoom-in bg-gray-50 dark:bg-gray-800"
            onClick={() => handleImageZoom(images[selectedImageIndex] || images[0])}
          >
            <img
              src={mainProductImage}
              alt={`${product.name} - Main view`}
              className="w-full h-80 lg:h-96 xl:h-[500px] object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x800?text=Product+Image';
              }}
            />
            <div className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition-all duration-300 shadow-lg">
              <Search className="w-5 h-5" />
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {images.length}
              {images[selectedImageIndex]?.color && (
                <span className="ml-2">• {getColorName(images[selectedImageIndex].color)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        {/* Color tabs for mobile if multiple colors */}
        {Object.keys(imagesByColor).length > 1 && (
          <div className="flex space-x-2 overflow-x-auto mb-3 pb-1">
            {Object.keys(imagesByColor).map(color => (
              <button
                key={color}
                onClick={() => {
                  const firstImageIndex = images.findIndex(img => img.color === color);
                  if (firstImageIndex !== -1) {
                    setSelectedImageIndex(firstImageIndex);
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  images[selectedImageIndex]?.color === color
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {getColorName(color)}
              </button>
            ))}
          </div>
        )}

        <div className="flex space-x-2 overflow-x-auto pb-3 mb-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${product.name} ${index + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                }}
              />
              {image.isPrimary && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white"></div>
              )}
            </button>
          ))}
        </div>

        <div 
          className="relative rounded-lg overflow-hidden cursor-zoom-in bg-gray-50 dark:bg-gray-800"
          onClick={() => handleImageZoom(images[selectedImageIndex] || images[0])}
        >
          <img
            src={mainProductImage}
            alt={`${product.name} - Main view`}
            className="w-full h-64 sm:h-80 object-contain"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x800?text=Product+Image';
            }}
          />
          <div className="absolute top-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-1.5 sm:p-2 transition-all duration-300 shadow-lg">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
            {selectedImageIndex + 1} / {images.length}
            {images[selectedImageIndex]?.color && (
              <span className="ml-1">• {getColorName(images[selectedImageIndex].color)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Product Badges */}
      <div className="flex flex-wrap gap-2 pt-2 sm:pt-4">
        {isInStock && (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1.5 sm:mr-2"></span>
            In Stock
          </span>
        )}
        {discount > 0 && (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mr-1.5 sm:mr-2"></span>
            {discount}% OFF
          </span>
        )}
        <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></span>
          {images.length} Photos
        </span>
      </div>

      {/* Zoom Modal */}
      {showZoomModal && zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={zoomedImage.imageUrl}
              alt="Zoomed product view"
              className="max-w-full max-h-[90vh] object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x800?text=Product+Image';
              }}
            />
            <button
              onClick={() => setShowZoomModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded text-sm">
              {zoomedImage.color} • {zoomedImage.size || 'All Sizes'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;