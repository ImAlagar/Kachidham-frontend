import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ShopByCategories from "../components/HomeComponents/ShopByCategories";
import Categories from "../components/HomeComponents/Categories";
import Loader from "../components/HomeComponents/SkeletonLoader";
import OurStory from "../components/HomeComponents/OurStory";
import { API_BASE_URL } from "../config/api";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();

  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true)
  const autoPlayDelay = 6000;
  const API = import.meta.env.VITE_API_BASE_URL2;
  /* ---------------- FETCH SLIDERS ---------------- */
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/sliders/active`);
        const json = res.data;

        if (json.success) {
          const sorted = [...json.data].sort((a, b) => a.order - b.order);
          setSlides(sorted);
        }
      } catch (err) {
        console.error("Failed to load sliders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);


  /* ---------------- AUTOPLAY ---------------- */
  useEffect(() => {
    if (!slides.length) return;

    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, autoPlayDelay);

    return () => clearTimeout(t);
  }, [index, slides]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98
    })
  };

  const goPrev = () =>
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () =>
    setIndex((i) => (i + 1) % slides.length);


  return (
    <section className="relative w-full">
      {/* SLIDER */}

      {loading ? (
        <div className="w-full h-[88vh] md:h-[92vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="relative w-full h-[88vh] md:h-[92vh] overflow-hidden">
          <AnimatePresence custom={1} initial={false}>
            {slides.map((slide, i) =>
              i === index ? (
                <motion.div
                  key={slide.id}
                  custom={1}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={variants}
                  onClick={() =>
                    slide.buttonLink
                      ? navigate(slide.buttonLink)
                      : null
                  }
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="absolute cursor-pointer inset-0 w-full h-full"
                >
                  {/* BACKGROUND IMAGE */}
                  <img
                    src={slide.image || slide.bgImage}
                    alt={slide.title}
                    className="block md:hidden w-full h-full object-cover"
                  />

                  {/* Desktop / Tablet Image */}
                  <img
                    src={slide.bgImage}
                    alt={slide.title}
                    className="hidden md:block w-full h-full object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/25" />

                  {/* CONTENT */}
                  <div className="absolute left-6 md:left-14 lg:left-24 bottom-12 md:bottom-20 z-50 md:max-w-[50%]">
                    <motion.h1
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.6 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-baijamjuree text-white tracking-widest"
                      style={{ fontStyle: "italic" }}
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="mt-3 text-lg md:text-2xl tracking-widest font-josefin text-white/90"
                    >
                      {slide.subtitle}
                    </motion.p>

                    {slide.buttonText && (
                      <motion.button
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        onClick={() =>
                          slide.buttonLink
                            ? navigate(slide.buttonLink)
                            : null
                        }
                        className="mt-6 inline-block bg-white text-primary px-5 py-1 md:px-6 md:py-2 rounded-sm font-josefin tracking-widest shadow-sm"
                      >
                        {slide.buttonText}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>

          {/* CONTROLS */}
          {slides.length > 1 &&
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 flex justify-between z-50 pointer-events-none">
              <button
                onClick={goPrev}
                className="pointer-events-auto p-3 bg-black/50 text-white rounded-full"
              >
                <MdKeyboardArrowLeft size={28} />
              </button>

              <button
                onClick={goNext}
                className="pointer-events-auto p-3 bg-black/50 text-white rounded-full"
              >
                <MdOutlineKeyboardArrowRight size={28} />
              </button>
            </div>
          }

          {/* DOTS */}
          {slides.length > 1 &&
            <div className="absolute left-6 md:left-14 bottom-6 z-50 flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
          }
        </div>
      )}
      {/* OTHER SECTIONS */}
      <ShopByCategories />
      <OurStory />
      <Categories />
    </section>
  );
}
