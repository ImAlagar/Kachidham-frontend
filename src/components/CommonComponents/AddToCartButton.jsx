import React from "react";
import border from "../../assets/border.png";

export default function AddToCartButton({
  product,
  selectedVariant,
  selectedColor,
  quantity,
  setError,
  onBeforeAdd,
  onAfterAdd
}) {

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onBeforeAdd && !onBeforeAdd()) return;

    if (!selectedColor) {
      setError("Please select color");
      return;
    }

    if (!selectedVariant) {
      setError("Please select size");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      item =>
        item.productId === product.id &&
        item.variantId === selectedVariant.id
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        variantId: selectedVariant.id,
        color: selectedColor,
        size: selectedVariant.size,
        price: product.offerPrice,
        quantity,
        image: selectedVariant.variantImages?.[0]?.imageUrl
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    if (onAfterAdd) onAfterAdd();
  };

  return (
  <div className=" relative z-0">
    <button onClick={addToCart} className="relative w-full h-12 group bg-transparent select-none z-10">
  {/* BORDER */}
  <img
    src={border}
    alt=""
    draggable="false"
    className="
      absolute inset-0
      w-full
      h-full
      object-fill
      pointer-events-none z-10
    "
  />

  {/* TEXT */}
  <span
    className="relative flex items-center justify-center h-full text-[#C8A25C] tracking-[0.25em] font-josefin text-sm group-hover:text-[#F6D28A] z-10">
    Add to Cart
  </span>
</button>
  </div>

);
}
