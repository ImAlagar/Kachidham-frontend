// ProductCard optimizations
import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default React.memo(function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showColors, setShowColors] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [error, setError] = useState(null);

  // Memoize expensive calculations
  const { primaryImage, secondaryImage, colors } = useMemo(() => {
    const images = product?.variants?.[0]?.variantImages || [];
    return {
      primaryImage: images[0]?.imageUrl || "/placeholder.png",
      secondaryImage: images[1]?.imageUrl || images[0]?.imageUrl || "/placeholder.png",
      colors: [...new Set(product.variants.map(v => v.color))]
    };
  }, [product]);

  // Memoize sorted sizes
  const sortedSizes = useMemo(() => {
    if (!selectedColor) return [];
    
    const filteredVariants = product.variants.filter(v => v.color === selectedColor);
    
    return [...filteredVariants].sort((a, b) => {
      const normalize = s => (s || "").toUpperCase().replace(/\s+/g, "");
      const aIndex = SIZE_ORDER.indexOf(normalize(a.size));
      const bIndex = SIZE_ORDER.indexOf(normalize(b.size));
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [selectedColor, product.variants]);

  // Memoize event handlers
  const handleBeforeAdd = useCallback(() => {
    if (!selectedColor) {
      setShowColors(true);
      setError("Please select color");
      return false;
    }

    if (!selectedVariant) {
      setShowSizes(true);
      setError("Please select size");
      return false;
    }

    setError(null);
    return true;
  }, [selectedColor, selectedVariant]);

  const handleAfterAdd = useCallback(() => {
    setSelectedVariant(null);
    setSelectedColor(null);
    setShowColors(false);
    setShowSizes(false);
    setError(null);
  }, []);

  const handleColorClick = useCallback((color) => {
    if (selectedColor === color) {
      setSelectedColor(null);
      setSelectedVariant(null);
      setShowSizes(false);
      setError(null);
    } else {
      setSelectedColor(color);
      setSelectedVariant(null);
      setShowSizes(true);
      setError(null);
    }
  }, [selectedColor]);

  const handleSizeClick = useCallback((variant) => {
    if (selectedVariant?.id === variant.id) {
      setSelectedVariant(null);
      setError(null);
    } else {
      setSelectedVariant(variant);
      setError(null);
    }
  }, [selectedVariant]);

  return (
    <div className="rounded-2xl overflow-hidden bg-transparent border border-[#c8a25c30] shadow-[0_10px_40px_rgba(200,162,92,.15)] hover:shadow-[0_20px_60px_rgba(200,162,92,.25)] hover:border-[#C8A25C70] transition-all duration-300">
      <Link to={`/product-details/${product.id}`} className="block">
        <div className="h-[300px] md:h-[350px] overflow-hidden relative">
          <img
            loading="lazy"
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-0"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <img
            loading="lazy"
            src={secondaryImage}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3 font-josefin">
        <h3 className="font-medium truncate text-secondary">{product.name}</h3>
        <p className="font-semibold text-secondary">₹ {product.offerPrice}</p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* COLORS */}
        {colors.length > 0 && (
          <div>
            <p className="text-sm mb-1 text-secondary font-josefin">Select Color</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  className={`px-3 py-1 text-xs border rounded transition-colors ${
                    selectedColor === color
                      ? "bg-secondary text-white border-primary"
                      : "border-secondary text-secondary hover:bg-gray-50"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SIZES */}
        {showSizes && selectedColor && (
          <div>
            <p className="text-sm mb-1 text-secondary font-josefin">Select Size</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {sortedSizes.map(variant => {
                const outOfStock = variant.stock === 0;
                const isSelected = selectedVariant?.id === variant.id;

                return (
                  <button
                    key={variant.id}
                    disabled={outOfStock}
                    onClick={() => !outOfStock && handleSizeClick(variant)}
                    className={`px-2 py-1 text-xs border rounded transition-colors flex-shrink-0 ${
                      outOfStock
                        ? "border-gray-300 text-gray-400 line-through cursor-not-allowed"
                        : isSelected
                          ? "bg-secondary text-white border-primary"
                          : "border-secondary text-secondary hover:bg-gray-50"
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
          selectedColor={selectedColor}
          quantity={1}
          onBeforeAdd={handleBeforeAdd}
          onAfterAdd={handleAfterAdd}
        />
      </div>
    </div>
  );
});