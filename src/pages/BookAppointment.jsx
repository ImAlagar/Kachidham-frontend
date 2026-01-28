import React, { useState } from "react";
import { API_BASE_URL } from "../config/api";
import axios from "axios";

export default function BookAppointment() {

  const [form, setForm] = useState({
    name: "",
    contactNumber: "", // Changed from "contact"
    whatsappNumber: "", // Changed from "whatsapp"
    fabricSource: "", // Changed from "fabricStatus"
    fabricDetails: "", // Added this field
    preferredDate: "", // Changed from "date"
    preferredTime: "", // Changed from "time"
  });

  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Append file with correct field name
      if (file) formData.append("referencePicture", file);

      // Make API call
      const response = await axios.post(`${API_BASE_URL}/api/design-inquiries`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }


      setSubmitted(true);

      // Reset form after successful submission
      setForm({
        name: "",
        contactNumber: "",
        whatsappNumber: "",
        fabricSource: "",
        fabricDetails: "",
        preferredDate: "",
        preferredTime: "",
      });
      setFile(null);

    } catch (err) {
      alert(err.message || "Something went wrong. Please try again.");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 py-12 bg-secondary/20">
      <div className="max-w-3xl mx-auto">
        <div className="
            bg-white rounded-2xl border border-[#c8a25c40]
            shadow-[0_10px_40px_rgba(200,162,92,.15)]
            hover:shadow-[0_20px_60px_rgba(200,162,92,.25)]
            transition-all duration-300 px-6 py-8
          ">

          <h2 className="text-center font-josefin text-3xl text-secondary mb-6">
            Book an Appointment
          </h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="text-secondary text-sm">Name</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="text-secondary text-sm">Contact Number</label>
                <input
                  required
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="text-secondary text-sm">WhatsApp Number</label>
                <input
                  required
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2"
                />
              </div>

              {/* Fabric Source */}
              <div>
                <label className="text-secondary text-sm block">Fabric Source</label>
                <select
                  name="fabricSource"
                  value={form.fabricSource}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg mt-1 px-4 py-2"
                >
                  <option value="">Select option</option>
                  <option value="TO_BE_SOURCED">Fabric to be sourced</option>
                  <option value="ALREADY_AVAILABLE">Fabric already available</option>
                </select>
              </div>

              {/* Fabric Details */}
              <div>
                <label className="text-secondary text-sm">Fabric Details</label>
                <textarea
                  name="fabricDetails"
                  value={form.fabricDetails}
                  onChange={handleChange}
                  placeholder="Describe your fabric (material, color, texture, etc.)"
                  className="w-full mt-1 border rounded-lg px-4 py-2 min-h-[80px]"
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label className="text-secondary text-sm">Preferred Date</label>
                <input
                  required
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="text-secondary text-sm">Preferred Time</label>
                <input
                  required
                  type="time"
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-4 py-2"
                />
              </div>

              {/* Reference Picture */}
              <div>
                <label className="text-secondary text-sm">Reference Picture</label>
                <input
                  type="file"
                  accept="image/*,.webp"
                  onChange={handleFile}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {file && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white rounded-lg py-3 font-josefin shadow hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Confirm Appointment"}
              </button>

            </form>
          ) : (
            <div className="text-center text-secondary font-josefin text-lg">
              Thank you! We will contact you shortly 💛
            </div>
          )}
        </div>
      </div>
    </section>
  );
}