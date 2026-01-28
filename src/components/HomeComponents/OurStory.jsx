import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import ourStory from "../../assets/ourstory.webp";

export default function OurStory() {
  return (
    <section 
      className="px-6 lg:px-20 py-16 overflow-hidden bg-[#0B1026] text-white"
      aria-labelledby="our-story-heading"
    >

      {/* SEO Meta */}
      <Helmet>
        <title>Kachidham — Our Story</title>
        <meta
          name="description"
          content="Kachidham is a brand built on perfection, uncompromised quality, and the confidence of the person who wears it."
        />
      </Helmet>

      <motion.div
        className="grid md:grid-cols-2 gap-10 items-center"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
      >

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
        >
          <motion.img
            src={ourStory}
            alt="Kachidham fashion craftsmanship"
            loading="lazy"
            className="rounded-xl object-cover w-full"
            initial={{ filter: "brightness(0.8)" }}
            whileInView={{ filter: "brightness(1)" }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        {/* TEXT */}
        <motion.article
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2 
            id="our-story-heading"
            className="text-2xl md:text-3xl font-baijamjuree font-semibold tracking-widest text-[#C8A25C] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            Our Story
          </motion.h2>

          <motion.p
            className="leading-loose font-josefin text-lg opacity-90 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            In Tamil, Kachidham translates to perfection, and that is exactly what we strive for from the very first thread. We are a brand built on the belief that quality should never be compromised.
          </motion.p>

          <motion.p
            className="leading-loose font-josefin text-lg opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            But our true motivation isn't just the fabric—it’s the person wearing it. Our "forever addictive goal" is that unmistakable, satisfactory smile that lights up a client’s face when they step into a Kachidham creation. When you feel perfect, we’ve done our job.
          </motion.p>

        </motion.article>
      </motion.div>
    </section>
  );
}
