// ProductInfo.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Heart, Zap, Minus, Plus, Star, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetRelatedProductsQuery } from '../../redux/services/productService';

const ProductInfo = ({
  product,
  variants,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  isLiked,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  isItemInCart,
  availableSizes,
  availableColors,
  getColorStock,
  getSizeStock,
  totalStock,
  isInStock,
  colorFromUrl,
  setSelectedImageIndex // Add this prop from parent
}) => {
  const discount = product.offerPrice && product.normalPrice
    ? Math.round(((product.normalPrice - product.offerPrice) / product.normalPrice) * 100)
    : 0;

  // Fetch related products
  const { data: relatedProductsData } = useGetRelatedProductsQuery({
    category: product.category,
    currentProductId: product._id,
    limit: 20
  }, {
    skip: !product.category || !product._id
  });

  const relatedProducts = relatedProductsData?.data || relatedProductsData || [];

  // Extract all colors from related products that match current product name/type
  const getRelatedColors = () => {
    if (!relatedProducts.length) return [];
    
    // Filter related products that have similar names/attributes
    const similarProducts = relatedProducts.filter(related => {
      const mainNameWords = product.name.toLowerCase().split(' ');
      const relatedNameWords = related.name.toLowerCase().split(' ');
      
      // Check if they share at least 2 common words or are same category
      const commonWords = mainNameWords.filter(word => 
        relatedNameWords.includes(word)
      );
      
      return commonWords.length >= 2 || related.category === product.category;
    });
    
    // Extract unique colors from variants of similar products
    const allColors = new Set();
    similarProducts.forEach(related => {
      if (related.variants?.length) {
        related.variants.forEach(variant => {
          if (variant.color && variant.stock > 0) {
            allColors.add(variant.color);
          }
        });
      }
    });
    
    return Array.from(allColors);
  };

  const relatedColors = getRelatedColors();
  
  // Combine current product colors with related product colors
  const allAvailableColors = useMemo(() => {
    const colorsSet = new Set([...availableColors, ...relatedColors]);
    return Array.from(colorsSet);
  }, [availableColors, relatedColors]);

  // Find product/variant that matches the selected color
  const findProductByColor = (color) => {
    // First check in current product variants
    const currentVariant = variants.find(v => 
      v.color?.toLowerCase() === color.toLowerCase()
    );
    
    if (currentVariant) {
      return {
        product: product,
        variant: currentVariant,
        isCurrentProduct: true
      };
    }
    
    // If not in current product, check in related products
    if (relatedProducts.length > 0) {
      for (const related of relatedProducts) {
        const variant = related.variants?.find(v => 
          v.color?.toLowerCase() === color.toLowerCase()
        );
        
        if (variant) {
          return {
            product: related,
            variant: variant,
            isCurrentProduct: false
          };
        }
      }
    }
    
    return null;
  };

  // Handle color selection with image change
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    
    const foundProduct = findProductByColor(color);
    
    if (foundProduct && foundProduct.isCurrentProduct) {
      // If it's current product variant, find image index
      const variant = foundProduct.variant;
      if (variant.variantImages?.length > 0) {
        // Find image index in current product images
        const images = product.images || [];
        const variantImageUrl = variant.variantImages[0]?.imageUrl;
        const imageIndex = images.findIndex(img => 
          img === variantImageUrl || 
          (typeof img === 'object' && img.url === variantImageUrl) ||
          (typeof img === 'object' && img.imageUrl === variantImageUrl)
        );
        
        if (imageIndex !== -1) {
          setSelectedImageIndex(imageIndex);
        }
      }
    } else if (foundProduct && !foundProduct.isCurrentProduct) {
      // If it's a related product, navigate to that product
      navigate(`/product/${foundProduct.product.slug || foundProduct.product._id}?color=${color}`);
    }
  };

  // Set color from URL when component mounts
  useEffect(() => {
    if (colorFromUrl && allAvailableColors.includes(colorFromUrl)) {
      const colorStock = getColorStock(colorFromUrl);
      if (colorStock > 0) {
        handleColorSelect(colorFromUrl);
      }
    }
  }, [colorFromUrl, allAvailableColors]);

  const isColorSelected = availableColors.length === 0 || (selectedColor && getColorStock(selectedColor) > 0);
  const isSizeSelected = availableSizes.length === 0 || (selectedSize && getSizeStock(selectedSize) > 0);
  const canAddToCart = isInStock && isColorSelected && isSizeSelected;

  const formatPrice = (price) => {
    return price?.toLocaleString('en-IN') || '0';
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Product Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">
          {product.name}
          {selectedColor && (
            <span className="text-lg sm:text-xl lg:text-2xl ml-2 opacity-75">
              ({selectedColor})
            </span>
          )}
        </h1>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-xl sm:text-2xl lg:text-3xl font-bold">
            ₹{formatPrice(product.offerPrice || product.normalPrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-lg sm:text-xl line-through text-gray-500 dark:text-gray-400">
                ₹{formatPrice(product.normalPrice)}
              </span>
              <span className="text-xs sm:text-sm font-medium px-2 py-1 rounded bg-red-100 text-red-800">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        {discount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              🎉 You save {discount}% 
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (₹{formatPrice(product.normalPrice - product.offerPrice)})
            </span>
          </div>
        )}
      </div>

      {/* Stock Info */}
      <div>
        {!isInStock ? (
          <p className="font-medium text-sm sm:text-base text-red-600 dark:text-red-400">Out of Stock</p>
        ) : totalStock < 10 ? (
          <p className="font-medium text-sm sm:text-base text-yellow-600 dark:text-yellow-400">
            Only {totalStock} left in stock!
          </p>
        ) : (
          <p className="font-medium text-sm sm:text-base text-green-600 dark:text-green-400">In Stock</p>
        )}
      </div>

      {/* Color Selection - Updated to show all colors */}
      {allAvailableColors.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base text-gray-900 dark:text-white">
            Available Colors: 
            <span className="font-normal text-gray-600 dark:text-gray-300 ml-2">
              {selectedColor || 'Select'}
            </span>
            {relatedColors.length > 0 && (
              <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 ml-2">
                ({relatedColors.length} more colors available in related products)
              </span>
            )}
          </h3>
          <div className="mb-3">
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
              {/* Current product colors */}
              {availableColors.map(color => {
                const isAvailable = getColorStock(color) > 0;
                const isColorFromUrl = color === colorFromUrl;
                
                return (
                  <ColorButton
                    key={`current-${color}`}
                    color={color}
                    isAvailable={isAvailable}
                    isSelected={selectedColor === color}
                    isColorFromUrl={isColorFromUrl}
                    stock={getColorStock(color)}
                    onClick={() => handleColorSelect(color)}
                    type="current"
                  />
                );
              })}
            </div>
            
            {/* Related product colors */}
            {relatedColors.filter(color => !availableColors.includes(color)).length > 0 && (
              <>
                <div className="flex items-center mb-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mr-2">
                    Also available in:
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {relatedColors
                    .filter(color => !availableColors.includes(color))
                    .map(color => {
                      const relatedProduct = findProductByColor(color);
                      const isAvailable = relatedProduct?.variant?.stock > 0 || true;
                      
                      return (
                        <ColorButton
                          key={`related-${color}`}
                          color={color}
                          isAvailable={isAvailable}
                          isSelected={selectedColor === color}
                          onClick={() => handleColorSelect(color)}
                          type="related"
                        />
                      );
                    })
                  }
                </div>
              </>
            )}
          </div>
          
          {/* Color info */}
          {selectedColor && (
            <div className="mt-2 flex flex-wrap items-center text-xs sm:text-sm">
              <span className={`font-medium ${
                getColorStock(selectedColor) > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {getColorStock(selectedColor) > 0 
                  ? `${getColorStock(selectedColor)} available in ${selectedColor}`
                  : `View ${selectedColor} in related products`
                }
              </span>
              
              {colorFromUrl && selectedColor === colorFromUrl && (
                <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">
                  (Selected from link)
                </span>
              )}
              
              {/* Show product info for related color */}
              {selectedColor && !availableColors.includes(selectedColor) && (
                <button
                  onClick={() => {
                    const foundProduct = findProductByColor(selectedColor);
                    if (foundProduct && !foundProduct.isCurrentProduct) {
                      navigate(`/product/${foundProduct.product.slug || foundProduct.product._id}?color=${selectedColor}`);
                    }
                  }}
                  className="ml-2 inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View {selectedColor} product
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <SizeSelection
          sizes={availableSizes}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          getSizeStock={getSizeStock}
        />
      )}

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        maxQuantity={totalStock}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        variants={variants}
      />

      {/* Action Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 xl:flex lg:flex-row gap-2 sm:gap-3 w-full items-stretch">
        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={!canAddToCart}
          className={`col-span-3 xl:flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base transition ${
            canAddToCart
              ? isItemInCart
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>
            {!isInStock 
              ? 'Out of Stock' 
              : isItemInCart 
                ? '✓ Added to Cart' 
                : 'Add to Cart'
            }
          </span>
        </button>

        {/* Buy Now Button */}
        <button
          onClick={onBuyNow}
          disabled={!canAddToCart}
          className={`col-span-3 lg:flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base transition ${
            canAddToCart
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span>Buy Now</span>
        </button>

        {/* Wishlist Button */}
        <button
          onClick={onToggleWishlist}
          className={`p-2 sm:p-3 rounded-lg border flex items-center justify-center transition-all duration-200 ${
            isLiked
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-600' : ''}`} />
        </button>
      </div>

      {/* Added to Cart Indicator */}
      {isItemInCart && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">This item is in your cart</span>
          </div>
          <Link 
            to="/cart" 
            className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Cart →
          </Link>
        </div>
      )}
    </div>
  );
};

// Color Button Component
const ColorButton = ({ color, isAvailable, isSelected, isColorFromUrl, stock, onClick, type }) => {
  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={`relative group flex flex-col items-center transition-all duration-200 ${
        isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      title={isAvailable ? `${color}${type === 'related' ? ' (Related Product)' : ''}` : 'Out of stock'}
    >
      <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
        isSelected && isAvailable
          ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
          : isColorFromUrl && isAvailable
            ? 'border-purple-500 ring-2 ring-purple-500 shadow-md'
            : isAvailable
              ? 'border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600'
              : 'border-gray-300 dark:border-gray-700 opacity-50'
      } ${type === 'related' ? 'ring-dashed ring-1' : ''}`}>
        <div 
          className="w-full h-full"
          style={{ backgroundColor: getColorHex(color) }}
        />
        {!isAvailable && (
          <>
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-400 transform rotate-45"></div>
            </div>
          </>
        )}
        {type === 'related' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white dark:border-gray-800">
            <span className="text-[8px] text-white">R</span>
          </div>
        )}
        {isColorFromUrl && isAvailable && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border border-white dark:border-gray-800"></div>
        )}
        {isAvailable && stock && stock < 5 && type === 'current' && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-500 rounded-full border border-white dark:border-gray-800"></div>
        )}
      </div>
      <span className={`mt-1 text-xs text-center max-w-12 truncate ${
        isSelected ? 'font-semibold text-blue-600' : 'text-gray-600 dark:text-gray-400'
      } ${!isAvailable ? 'line-through' : ''}`}>
        {color}
      </span>
    </button>
  );
};

// Helper function to get color hex
const getColorHex = (color) => {
  const colorMap = {
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#00ff00',
    'black': '#000000',
    'white': '#ffffff',
    'yellow': '#ffff00',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'orange': '#ffa500',
    'gray': '#808080',
    'navy': '#000080',
    'sandle': '#8b4513',
    'brown': '#a52a2a',
    'beige': '#f5f5dc',
    'maroon': '#800000',
    'cream': '#fffdd0',
    'offwhite': '#f8f8f8',
    'olive': '#808000',
    'teal': '#008080',
    'cyan': '#00ffff',
    'magenta': '#ff00ff',
    'silver': '#c0c0c0',
    'gold': '#ffd700'
  };
  
  const lowerColor = color.toLowerCase();
  return colorMap[lowerColor] || color;
};

// Size Selection Component (unchanged)
const SizeSelection = ({ sizes, selectedSize, onSelectSize, getSizeStock }) => {
  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm sm:text-base text-gray-900 dark:text-white">
        Choose Size: <span className="font-normal text-gray-600 dark:text-gray-300">
          {selectedSize || (sizes.find(size => getSizeStock(size) > 0)?.size || 'Select')}
        </span>
      </h3>
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {sizes.map(size => {
          const isAvailable = getSizeStock(size) > 0;
          
          return (
            <button
              key={size}
              onClick={() => isAvailable && onSelectSize(size)}
              disabled={!isAvailable}
              className={`relative px-3 py-2 sm:px-4 sm:py-2 rounded border text-xs sm:text-sm transition-all duration-200 ${
                selectedSize === size && isAvailable
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : !isAvailable
                    ? 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {size}
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-600 transform rotate-45"></div>
                </div>
              )}
              {isAvailable && getSizeStock(size) < 5 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full border border-white dark:border-gray-800"></div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between items-center">
        {selectedSize && (
          <span className={`text-xs sm:text-sm font-medium ${
            getSizeStock(selectedSize) > 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {getSizeStock(selectedSize) > 0 
              ? `${getSizeStock(selectedSize)} available in ${selectedSize}`
              : `${selectedSize} is out of stock`
            }
          </span>
        )}
      </div>
    </div>
  );
};

// Quantity Selector Component (unchanged)
const QuantitySelector = ({ quantity, setQuantity, maxQuantity, selectedColor, selectedSize, variants }) => {
  const getMaxQuantity = () => {
    if (selectedColor && selectedSize) {
      const variant = variants.find(v => 
        v?.color?.toLowerCase() === selectedColor.toLowerCase() && 
        v?.size === selectedSize
      );
      return variant?.stock || maxQuantity;
    }
    return maxQuantity;
  };

  const currentMax = getMaxQuantity();

  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <label className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
        Quantity:
      </label>
      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base transition ${
            quantity <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 sm:px-5 py-1 min-w-10 sm:min-w-14 text-center text-sm sm:text-base text-gray-900 dark:text-white">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          disabled={quantity >= currentMax}
          className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base transition ${
            quantity >= currentMax
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;