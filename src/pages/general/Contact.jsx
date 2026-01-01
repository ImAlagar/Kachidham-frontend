import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from 'react-redux';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaPaperPlane,
  FaCheckCircle,
  FaMapMarkerAlt
} from "react-icons/fa";
import { 
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ChevronRight,
  Sparkle,
  Bed,
  Package,
  Shield,
  Crown
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCreateContactMutation } from "../../redux/services/contactService";
import AnimatedIcon from "../../components/Common/AnimatedIcon";
import { 
  PAGE_TRANSITIONS, 
  HOVER_ANIMATIONS 
} from "../../constants/animationConstants";

export default function Contact() {
  const { theme } = useTheme();
  const user = useSelector(state => state.auth.user);
  const [createContact, { isLoading, isSuccess }] = useCreateContactMutation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  // Simple theme styles
  const bgColor = theme === "dark" 
    ? "bg-gradient-to-b from-gray-900 to-gray-950"
    : "bg-gradient-to-b from-white to-gray-50";
  
  const cardBg = theme === "dark"
    ? "bg-gray-800"
    : "bg-white";
  
  const borderColor = theme === "dark" 
    ? "border-gray-700" 
    : "border-gray-200";
  
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const accentColor = "text-purple-500";
  const buttonGradient = "bg-gradient-to-r from-purple-600 to-pink-500";

  // Inquiry types
  const inquiryTypes = [
    { id: "general", label: "General Inquiry", icon: MessageSquare },
    { id: "custom", label: "Custom Nightwear", icon: Sparkle },
    { id: "sizing", label: "Size & Fit", icon: Bed },
    { id: "wholesale", label: "Wholesale", icon: Package },
  ];

  // Contact methods
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 99403 34421",
      action: () => window.location.href = "tel:+9199403 34421",
      subtitle: "Mon-Sat, 10AM-8PM"
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      value: "Start Chat",
      action: () => window.open(`https://wa.me/9199403 34421?text=${encodeURIComponent("Hello kachidham Fashions! I need help with nightwear selection.")}`, "_blank"),
      subtitle: "Instant response"
    },
    {
      icon: Mail,
      title: "Email",
      value: "kachidham Fashionsclothing25@gmail.com",
      action: () => window.location.href = "mailto:kachidham Fashionsclothing25@gmail.com",
      subtitle: "Within 12 hours"
    },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        userId: user?.id || null,
      };
      
      await createContact(submissionData).unwrap();
      
      // Reset form on success
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    }
  };

  // Pre-fill form with user data
  React.useEffect(() => {
    if (user && !formData.name && !formData.email) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <AnimatedIcon 
              icon={Crown}
              animation="pulse"
              className="w-12 h-12 text-purple-500"
            />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}>
            Contact <span className="text-purple-500">kachidham Fashions</span>
          </h1>
          <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
            Get in touch with our team for personalized nightwear assistance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Methods */}
            <div className={`rounded-2xl ${cardBg} p-6 border ${borderColor}`}>
              <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>
                Quick Contact
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={method.action}
                    className={`w-full text-left p-4 rounded-lg border ${borderColor} hover:border-purple-500 transition-all duration-300 flex items-center gap-3`}
                  >
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <AnimatedIcon 
                        icon={method.icon}
                        animation="pulse"
                        className={accentColor}
                        size={20}
                      />
                    </div>
                    <div>
                      <div className={`font-medium ${textPrimary}`}>{method.title}</div>
                      <div className="text-sm font-medium text-purple-500">{method.value}</div>
                      <div className="text-xs text-gray-500">{method.subtitle}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Office Info */}
            <div className={`rounded-2xl ${cardBg} p-6 border ${borderColor}`}>
              <div className="flex items-center gap-3 mb-4">
                <AnimatedIcon 
                  icon={MapPin}
                  animation="float"
                  className={accentColor}
                  size={20}
                />
                <h3 className={`text-xl font-semibold ${textPrimary}`}>
                  Our Studio
                </h3>
              </div>
              <p className={`${textSecondary} mb-4`}>
                Andiappan street<br />
                Old washermenpet-21
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open("https://maps.google.com/?q=Andiappan street,Old washermenpet-21", "_blank")}
                className={`w-full ${buttonGradient} text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2`}
              >
                <FaMapMarkerAlt />
                View on Map
              </motion.button>
            </div>


          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl ${cardBg} p-6 lg:p-8 border ${borderColor}`}
            >
              {/* Success Message */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                  >
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <div>
                      <div className="font-medium text-green-600 dark:text-green-400">
                        Message sent successfully!
                      </div>
                      <div className="text-sm text-green-500/80">
                        We'll respond within 12 hours.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Header */}
              <div className="mb-8">
                <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                  Send us a Message
                </h2>
                <p className={textSecondary}>
                  Fill out the form and our team will get back to you promptly
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textSecondary}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textPrimary} ${
                        theme === "dark" ? "bg-gray-900" : "bg-white"
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textSecondary}`}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textPrimary} ${
                        theme === "dark" ? "bg-gray-900" : "bg-white"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textSecondary}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textPrimary} ${
                        theme === "dark" ? "bg-gray-900" : "bg-white"
                      }`}
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textSecondary}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject of your message"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textPrimary} ${
                        theme === "dark" ? "bg-gray-900" : "bg-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6 space-y-2">
                  <label className={`block text-sm font-medium ${textSecondary}`}>
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please describe your inquiry in detail..."
                    required
                    className={`w-full px-4 py-3 rounded-lg border ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textPrimary} ${
                      theme === "dark" ? "bg-gray-900" : "bg-white"
                    } resize-none`}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full ${buttonGradient} text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* Privacy Note */}
                <p className={`text-center text-xs ${textSecondary} mt-4`}>
                  By submitting this form, you agree to our privacy policy
                </p>
              </form>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
} 