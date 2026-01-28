import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/HomeComponents/SkeletonLoader";
import AddToCartButton from "../components/CommonComponents/AddToCartButton";
import { API_BASE_URL } from "../config/api";
import { CiLock } from "react-icons/ci";
import AddReview from "../components/CommonComponents/AddReview";
import ProductReviews from "../components/CommonComponents/ProductReviews";
import { toast } from "react-toastify";
import axios from "axios";

const SIZE_ORDER = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate()
  const location = useLocation()
  const imgRef = React.useRef(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [user, setUser] = useState('')
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem('token')
    setUser(storedUser)
  }, [])

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}/api/products/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const json = res.data;

      if (!json.success) {
        throw new Error(json.message || "Failed to load product");
      }

      setProduct(json.data);

      const uniqueImages = Array.from(
        new Set(
          json.data?.variants?.flatMap(v =>
            v.variantImages?.map(img => img.imageUrl)
          )
        )
      );

      setActiveImage(uniqueImages[0] || "");
    } catch (err) {
      console.error(err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!product) return null;

  /* -------------------- Images -------------------- */
  const images = Array.from(
    new Set(
      product.variants?.flatMap(v =>
        v.variantImages?.map(img => img.imageUrl)
      )
    )
  );

  /* -------------------- Colors -------------------- */
  const colors = Array.from(
    new Set(product.variants.map(v => v.color))
  );

  /* -------------------- Sizes (filtered by color) -------------------- */
  const filteredVariants = selectedColor
    ? product.variants.filter(v => v.color === selectedColor)
    : [];

  const normalizeSize = (size = "") =>
    size.toUpperCase().replace(/\s+/g, "");

  const sizes = [...filteredVariants].sort((a, b) => {
    const aKey = normalizeSize(a.size);
    const bKey = normalizeSize(b.size);

    const aIndex = SIZE_ORDER.indexOf(aKey);
    const bIndex = SIZE_ORDER.indexOf(bKey);

    // Put unknown sizes at the end (safety)
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });


  /* -------------------- Validation -------------------- */
  const validateSelection = () => {

    if (!selectedColor) {
      setError("Please select a color");
      return false;
    }
    if (!selectedVariant) {
      setError("Please select a size");
      return false;
    }

    return true;
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    if (!user) {
      toast.error("Login required for checkout");
      navigate("/login", {
        state: {
          from: location.pathname,
          intent: "buy-now"
        }
      });
      return;
    }
    else {
      const checkoutData = {
        items: [
          {
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            image: activeImage,
            price: Number(product.offerPrice),
            quantity: quantity,
            size: selectedVariant.size,
            color: selectedColor
          }
        ],
        subtotal: selectedVariant.price * quantity
      };

      navigate("/checkout", {
        state: checkoutData
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();

    // Calculate mouse position relative to the image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Convert to percentage
    const percentX = (x / width) * 100;
    const percentY = (y / height) * 100;

    setShowZoom(true);
    setZoomStyle({
      backgroundImage: `url(${activeImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "300% 300%", // Adjust this for zoom level
      backgroundPosition: `${percentX}% ${percentY}%`,
      pointerEvents: "none", // Critical: prevents flickering
    });
  };

const addToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!selectedColor) return setError("Please select color");
  if (!selectedVariant) return setError("Please select size");

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
      stock: Number(selectedVariant.stock), 
      quantity,
      image: selectedVariant.variantImages?.[0]?.imageUrl
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};


  return (
    <section className="px-6 py-10">
      <div className="grid grid-row-1 xl:grid-cols-2 gap-10">

        {/* LEFT – Images */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-6 flex-col md:flex-row top-10 self-start"
        >

          {/* LEFT SIDE THUMBNAILS */}
          {images.length > 1 && (
            <div className="flex flex-row md:flex-col gap-3 w-[95px] order-2 md:order-1">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(img)}
                  className={`w-[90px] h-[110px] object-cover rounded-lg border cursor-pointer 
                  transition hover:scale-105
                  ${activeImage === img
                      ? "border-secondary border-[3px]"
                      : "border-gray-300"
                    }`}
                />
              ))}
            </div>
          )}

          {/* MAIN IMAGE + ZOOM */}
          <div className="relative order-1 md:order-2">

            <div
              ref={imgRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setShowZoom(false)}
              className="md:w-[520px] h-[620px] overflow-hidden rounded-xl border cursor-zoom-in"
            >
              <img
                src={activeImage}
                className="w-full h-full object-cover"
              />
            </div>

            {showZoom && (
              <div
                className="absolute top-0 left-[105%] 
                w-[480px] h-full border-2 
                rounded-xl shadow-2xl bg-white 
                hidden lg:block z-50"
                style={zoomStyle}
              />
            )}
          </div>

        </motion.div>

        {/* RIGHT – Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-3xl text-primary font-baijamjuree tracking-widest font-semibold">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-josefin font-semibold">
              ₹ {product.offerPrice}
            </span>
            {product.normalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ₹ {product.normalPrice}
              </span>
            )}
          </div>

          {product.productCode && (
            <p className="font-josefin text-gray-600">
              Product code: {product.productCode}
            </p>
          )}

          {product.subcategory?.name && (
            <p className="font-josefin text-lg">
              Category:{" "}
              <span className="text-primary">
                {product.subcategory.name}
              </span>
            </p>
          )}

          <div className="flex items-center gap-2 font-josefin">
            <CiLock className="text-2xl" />
            <span className="text-lg">Secured payment</span>
          </div>

          {/* ----------- COLOR ----------- */}
          <div>
            <p className="font-semibold tracking-widest mb-2">
              Select Color
            </p>
            <div className="flex gap-3 flex-wrap">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedVariant(null);
                    setQuantity(1);
                    setError("");
                  }}
                  className={`px-4 py-2 border rounded text-sm tracking-wider transition
                      ${selectedColor === color
                      ? "bg-primary text-white"
                      : "border-primary hover:bg-primary hover:text-white"}
                    `}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* ----------- SIZE ----------- */}
          {selectedColor && (
            <div>
              <p className="font-semibold tracking-widest mb-2">
                Select Size
              </p>

              <div className="flex flex-wrap gap-3">
                {sizes.map(variant => {
                  const outOfStock = variant.stock === 0;
                  const isSelected = selectedVariant?.id === variant.id;

                  return (
                    <button
                      key={variant.id}
                      disabled={outOfStock}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1);
                        setError("");
                      }}
                      className={`px-4 py-2 border rounded text-sm tracking-wider transition
                          ${outOfStock
                          ? "text-gray-400 border-gray-300 line-through cursor-not-allowed"
                          : isSelected
                            ? "bg-primary text-white"
                            : "border-primary hover:bg-primary hover:text-white"}
                        `}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------- QUANTITY ----------- */}
          {selectedVariant && (
            <div>
              <p className="font-semibold tracking-widest mb-2">
                Quantity
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 border rounded text-lg"
                >
                  −
                </button>

                <span className="text-lg font-semibold w-10 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(q =>
                      Math.min(selectedVariant.stock, q + 1)
                    )
                  }
                  className="px-4 py-2 border rounded text-lg"
                >
                  +
                </button>

                <span className="text-sm text-gray-500">
                  {selectedVariant.stock} available
                </span>
              </div>
            </div>
          )}


          {error && (
            <p className="text-center text-red-600 tracking-widest">
              {error}
            </p>
          )}

          {/* ADD TO CART */}
          {/* <AddToCartButton
            product={product}
            selectedVariant={selectedVariant}
            selectedColor={selectedColor}
            quantity={quantity}
            setError={setError}
          /> */}
          <button
            onClick={addToCart}
            className="w-full text-base sm:text-lg bg-primary text-white hover:bg-gray-800 py-2 tracking-widest font-josefin transition"
          >
            Add to cart
          </button>

          {/* BUY NOW */}
          <button
            onClick={handleBuyNow}
            className="w-full text-base sm:text-lg bg-primary text-white hover:bg-gray-800 py-2 tracking-widest font-josefin transition"
          >
            Buy Now
          </button>

          {/* PRODUCT DETAILS */}
          {product.productDetails?.length > 0 && (
            <div className="mt-10 space-y-4">
              <h2 className="text-xl font-baijamjuree tracking-widest font-semibold">
                Product Details
              </h2>

              {product.productDetails.map(detail => (
                <div key={detail.id} className="flex gap-2">
                  <span className="font-josefin font-bold">
                    {detail.title}:
                  </span>
                  <span className="font-josefin">
                    {detail.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AddReview />
      <ProductReviews />
    </section>
  );
}
