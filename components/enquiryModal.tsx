"use client";

import { useState } from "react";
import { createEnquiry } from "@/lib/api/enquiry";
import { X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { on } from "events";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields?: Field[];
}

export default function EnquiryModal({
  isOpen,
  onClose,
  fields = [
    { name: "cstmr_name", label: "Full Name", type: "text", required: true },
    { name: "cstmr_email", label: "Email", type: "email" },
    { name: "cstmr_phone", label: "Phone Number", type: "text", required: true },
    { name: "cstmr_message", label: "Message", type: "textarea" },
  ],
}: EnquiryModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast(); 

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  for (const field of fields) {
    if (field.required && !formData[field.name]) {
      showError(`${field.label} is required`);
      setLoading(false);
      return;
    }
  }

  try {
    const payload = { ...formData, enquiry_type: 2 }; 
    const res = await createEnquiry(payload);

    showSuccess("Enquiry sent successfully!");
    setFormData({});
    onClose();  
  } catch (err: any) {
    showError(err?.message || "Something went wrong! Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-[#087fc2]">
          Enquire Now
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  rows={4}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#1F67A5] to-[#087fc2] text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
