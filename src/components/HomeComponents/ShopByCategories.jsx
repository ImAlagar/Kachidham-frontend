import React, { useRef, useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { motion } from "framer-motion";
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

import frame1 from "../../assets/frame1.png";
import frame2 from "../../assets/frame2.png";
import frame3 from "../../assets/frame3.png";
import flower from "../../assets/flower.png";
import underline1 from '../../assets/underline1.png'
import underline2 from '../../assets/underline2.png'
import SkeletonLoader from "./SkeletonLoader";

export default function ShopByCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);

  const frames = [frame1, frame2, frame3];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/subcategory`);
        const data = await res.json();
        if (data.success) setCategories(data.data.filter(c => c.isActive));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);


  const items = [...categories, ...categories];

  useEffect(() => {
    startScroll();
    return stopScroll;
  }, []);

  const startScroll = () => {
    stopScroll();
    autoScrollRef.current = setInterval(() => {
      if (!containerRef.current) return;
      containerRef.current.scrollLeft += 1;
      if (containerRef.current.scrollLeft >= containerRef.current.scrollWidth / 2)
        containerRef.current.scrollLeft = 0;
    }, 16);
  };

  const stopScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  const scroll = dir => {
    stopScroll();
    containerRef.current.scrollBy({ left: dir, behavior: "smooth" });
    setTimeout(startScroll, 1000);
  };

    if(loading){
    return(
      <div className="py-20 flex justify-center items-center"><SkeletonLoader /></div>
    )
  }
  return (
    <section className="px-6 lg:px-20 pt-16 relative bg-[#0B1026]">

      {/* HEADING ANIMATION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex flex-col justify-center gap-2 mb-12 items-center"
      >
        <h2 className="text-xl md:text-3xl font-semibold font-baijamjuree text-center tracking-[0.25em] text-secondary">
          SHOP BY CATEGORIES
        </h2>

        <h3 className="text-secondary font-josefin tracking-widest">Kachidham made for you</h3>

        <img
          className="w-52"
          src={underline1}
          alt="Decorative underline floral accent"
          loading="lazy"
        />
      </motion.div>

      {/* LEFT ARROW */}
      <button
        onClick={() => scroll(-300)}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 
        w-12 h-12 rounded-full  text-secondary border border-secondary 
        shadow-lg justify-center items-center"
        aria-label="Scroll categories left"
      >
        <MdKeyboardArrowLeft />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scroll(300)}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 
        w-12 h-12 rounded-full  text-secondary border border-secondary 
        shadow-lg justify-center items-center"
        aria-label="Scroll categories right"
      >
        <MdOutlineKeyboardArrowRight />
      </button>

      {/* CARD LIST WITH STAGGER */}
      <motion.div
        ref={containerRef}
        onMouseEnter={stopScroll}
        onMouseLeave={startScroll}
        className="flex gap-14 overflow-x-scroll no-scrollbar px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.12 }}
      >
        {!loading &&
          items.map((cat, i) => {
            const frame = frames[i % 3];

            return (
              <motion.div
                key={`${cat.id}-${i}`}
                className="min-w-[240px]"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Link
                  to={`/shop/subcategory/${cat.id}`}
                  className="min-w-[240px] text-center"
                >
                  {/* CARD */}
                  <div
                    className="relative w-60 mx-auto aspect-[3/4] 
                    rounded-xl transition-all duration-500 
                    hover:scale-[1.03]"
                  >
                    {/* FRAME */}
                    <img
                      src={frame}
                      className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
                      alt="Decorative gold frame"
                      loading="lazy"
                    />

                    {/* IMAGE */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
                      <img
                        src={cat.image}
                        alt={cat.name + ' category preview'}
                        className="w-full h-full p-2 px-3 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* TITLE */}
                  <div className="flex items-center justify-center mt-6 gap-3">
                    <img src={flower} className="w-6 opacity-80" alt="" loading="lazy" />
                    <p className="text-[#C8A25C] font-josefin tracking-[0.25em] text-sm md:text-base">
                      {cat.name.toUpperCase()}
                    </p>
                    <img src={flower} className="w-6 opacity-80" alt="Flower design for" loading="lazy" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
         
      </motion.div>
       <div className="w-full mt-5 flex justify-center items-center">
            <img className="w-72 select-none pointer-events-none" src={underline2} alt="Underline for end" />
          </div>
    </section>
  );
}
