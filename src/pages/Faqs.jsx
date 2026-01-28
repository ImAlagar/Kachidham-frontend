import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config/api";
import axios from "axios";

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/faqs`);
        const data = res.data;

        if (data.success) setFaqs(data.data || []);
        else setError("Failed to load FAQs");
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section className="bg-[#0B1026] text-white min-h-screen px-6 lg:px-24 py-20">

      {/* SEO */}
      <Helmet>
        <title>Kachidham — Frequently Asked Questions</title>
        <meta
          name="description"
          content="Find answers to all your questions about Kachidham sarees, designer collections, shipping, returns, custom orders and more."
        />
      </Helmet>

      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h1 className="font-baijamjuree tracking-[0.35em] text-[#C8A25C] text-2xl md:text-4xl">
          FREQUENTLY ASKED QUESTIONS
        </h1>

        <p className="text-gray-300 mt-4 font-josefin">
          Everything you need to know — answered with care ✨
        </p>
      </motion.div>


      {/* ERROR */}
      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}


      {/* LOADING */}
      {loading && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="animate-pulse bg-white/10 h-14 rounded-lg"
            />
          ))}
        </div>
      )}


      {/* FAQ LIST */}
      {!loading && !error && (
        <div className="max-w-4xl mx-auto space-y-6">

          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="border border-[#C8A25C]/40 rounded-xl overflow-hidden"
            >

              {/* QUESTION */}
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full text-left px-6 py-4 
                flex justify-between items-center 
                font-josefin tracking-wider"
              >
                <span>{faq.question}</span>

                <span className="text-[#C8A25C] text-xl">
                  {openIndex === index ? "-" : "+"}
                </span>
              </button>


              {/* ANSWER */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-5 text-gray-300 font-josefin leading-8"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ))}

        </div>
      )}
    </section>
  );
}
