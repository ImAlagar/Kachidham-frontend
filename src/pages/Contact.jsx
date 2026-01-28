import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaPaperPlane } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import { FaPinterest } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

/* ---------------- ANIMATION VARIANTS ---------------- */

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const formVariant = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/contacts`, form, {
        headers: { "Content-Type": "application/json" },
      });

      const json = res.data;
      if (json.success) {
        setSuccess("Message sent successfully!");
        setForm({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 lg:py-16 bg-secondary/20">
      <h1 className="text-center font-baijamjuree text-primary text-xl font-semibold tracking-widest uppercase md:text-4xl pb-5">
        Contact us
      </h1>
      <motion.div
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT INFO CARDS */}
        <motion.div
          className="grid sm:grid-cols-2 gap-6"
          variants={containerVariant}
        >
          <InfoCard
            icon={<FaEnvelope className="text-yellow-400 text-2xl" />}
            title="Email"
            text="customersupport@kachidham.com"
          />
          <InfoCard
            icon={<FaPhoneAlt className="text-green-500 text-2xl" />}
            title="Phone"
            text="+91 85088 96699"
          />
          <InfoCard
            icon={<FaPinterest className="text-red-500 text-2xl" />}
            title="Pinterest"
            text="Kachidham Pinterest"
          />
          <InfoCard
            icon={<FaInstagram className="text-orange-500 text-2xl" />}
            title="Instagram"
            text="kachidham"
          />
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          variants={formVariant}
          className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5 font-josefin">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm tracking-widest">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                placeholder="Type your message..."
                value={form.message}
                onChange={handleChange}
                className="w-full bg-transparent border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 ease-in-out"
              />
            </div>

            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 text-sm"
              >
                {success}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold tracking-widest
              bg-primary hover:opacity-90 transition"
            >
              <FaPaperPlane />
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

const InfoCard = ({ icon, title, text, isWhatsapp }) => {
  // build correct link
  const handleClick = () => {
    if (title === "Email") {
      window.location.href = `mailto:${text}`;
    }
    if (title === "Phone") {
      window.location.href = `tel:${text}`;
    }
    if (isWhatsapp) {
      window.open("https://wa.me/918122747148", "_blank");
    }
    if (title === "Pinterest") {
      window.open(
        "https://pin.it/Ga5EOZSt4",
        "_blank",
      );
    }
    if (title === "Instagram") {
      window.open(
        "https://www.instagram.com/kachidham?igsh=MXZqNGUzcm10YjV0OA==",
        "_blank",
      );
    }
  };

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ scale: 1.05 }}
      className="bg-white/50 border-2 h-52 border-primary backdrop-blur-lg rounded-xl flex flex-col justify-center items-center text-center p-6 shadow-md space-y-2 cursor-pointer"
      onClick={handleClick}
    >
      <div>{icon}</div>
      <h3 className="font-semibold font-baijamjuree tracking-widest text-primary">
        {title}
      </h3>

      {/* underline to show clickable */}
      <p className="text-sm font-josefin text-gray-700 underline">{text}</p>
    </motion.div>
  );
};

const Input = ({ label, ...props }) => (
  <motion.div variants={cardVariant}>
    <label className="block mb-2 text-sm tracking-widest">{label}</label>
    <input
      {...props}
      required
      className="w-full bg-transparent border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 ease-in-out"
    />
  </motion.div>
);
