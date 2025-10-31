"use client";
import React, { useState, useRef } from "react";
import { createEnquiry } from "@/lib/api/enquiry";
import { Toast } from "primereact/toast";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    cstmr_name: "",
    cstmr_email: "",
    cstmr_phone: "",
    cstmr_message: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    toast.current?.show({
      severity: type,
      summary: type === "success" ? "Success" : "Error",
      detail: type === "success" ? "Enquiry sent successfully!" : message,
      life: 5000,

    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cstmr_name.trim()) {
      showToast("error", "Please enter your name.");
      return;
    }
    if (!formData.cstmr_phone.trim()) {
      showToast("error", "Please enter your phone number.");
      return;
    }
    if (!formData.cstmr_message.trim()) {
      showToast("error", "Please enter your message.");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...formData, enquiry_type: 1 };
      const response = await createEnquiry(payload);

      if (response?.message) {
        showToast("success", "Enquiry sent successfully!");
        setTimeout(() => {
          setFormData({
            cstmr_name: "",
            cstmr_email: "",
            cstmr_phone: "",
            cstmr_message: "",
          });
        }, 800); // ✅ Small delay before clearing
      } else {
        showToast("error", "Failed to send enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      showToast("error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f7fbff] py-16 px-6 md:px-10">
      {/* ✅ Toast Container */}
      <Toast ref={toast} position="top-right" />

      <div className="max-w-7xl mx-auto space-y-16">
        <div className="bg-white shadow-md rounded-2xl p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT CONTACT DETAILS */}
          <div>
            <h3 className="text-xl font-semibold mb-1 md:mb-2 text-gray-900">
              Address
            </h3>
            <p className="text-gray-700 md:mb-6 mb-4">
              Aysha Near GCHSS, Manjeri Malappuram Dt. Kerala
            </p>

            <h3 className="text-xl font-semibold mb-1 md:mb-2 text-gray-900">
              Phone
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              0483-2769220 <br />
              9995076789, 9072676783 <br />
              9048058888, 7593002222
            </p>

            <h3 className="text-xl font-semibold mb-1 md:mb-2 text-gray-900">
              Email
            </h3>
            <p className="text-gray-700 mb-6">info@aceinstitute.com</p>

            <h3 className="text-xl font-semibold mb-3 text-gray-900">Follow</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition"
              >
                <IconBrandFacebook />
              </a>
              <a
                href="#"
                className="bg-pink-400 text-white p-2 rounded-md hover:bg-pink-500 transition"
              >
                <IconBrandInstagram />
              </a>
              <a
                href="#"
                className="bg-sky-400 text-white p-2 rounded-md hover:bg-sky-500 transition"
              >
                <IconBrandTwitter />
              </a>
              <a
                href="#"
                className="bg-red-400 text-white p-2 rounded-md hover:bg-red-500 transition"
              >
                <IconBrandYoutube />
              </a>
            </div>
          </div>

          {/* RIGHT ENQUIRY FORM */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              Enquiry Form
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cstmr_name"
                  value={formData.cstmr_name}
                  onChange={handleChange}
                  className="w-full bg-blue-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cstmr_phone"
                  value={formData.cstmr_phone}
                  onChange={handleChange}
                  className="w-full bg-blue-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="cstmr_email"
                  value={formData.cstmr_email}
                  onChange={handleChange}
                  className="w-full bg-blue-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  name="cstmr_message"
                  value={formData.cstmr_message}
                  onChange={handleChange}
                  className="w-full bg-blue-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-[#176090] hover:to-[#0088c7] text-white px-6 py-2 rounded-md transition ${
                    loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="h-full flex flex-col justify-center md:px-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Find us on the map
            </h3>
            <p className="text-gray-700 mb-3">
              Aysha Near GCHSS, Manjeri Malappuram Dt. Kerala
            </p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Get Direction
            </a>
          </div>

          <div className="rounded-xl col-span-2 overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.914702787878!2d76.11521197409212!3d11.119730452769499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6366fd4c48b8f%3A0x114b8b541134cc53!2sACE%20Institutions!5e0!3m2!1sen!2sin!4v1760627839488!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
