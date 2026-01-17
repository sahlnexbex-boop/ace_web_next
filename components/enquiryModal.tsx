"use client";

import { X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { createEnquiry } from "@/lib/api/enquiry";
import { useForm } from "react-hook-form";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiryType: string | number;
  courseId?: string | number;
  fields?: Field[];
}

export default function EnquiryModal({
  isOpen,
  onClose,
  enquiryType,
  courseId,
  fields = [
    { name: "cstmr_name", label: "Full Name", type: "text", required: true },
    { name: "cstmr_email", label: "Email", type: "email" },
    { name: "cstmr_phone", label: "Phone Number", type: "text", required: true },
    { name: "cstmr_message", label: "Message", type: "textarea" },
  ],
}: EnquiryModalProps) {
  const { showSuccess, showError } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      cstmr_name: "",
      cstmr_email: "",
      cstmr_phone: "",
      cstmr_message: "",
      course_id: courseId || "",
    },
  });

  if (!isOpen) return null;

  const validateName = (value: string) => {
    if (!value) return "Full Name is required";
    if (!/[A-Za-z]/.test(value)) return "Name must include letters";
    return true;
  };

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) return "Phone number must be at least 10 digits";
    if (digits.length > 17) return "Phone number must be at most 17 digits";
    return true;
  };

  const validateEmail = (value: string) => {
    if (!value) return true; 
    if (!value.endsWith("@gmail.com")) return "Email must be a @gmail.com address";
    return true;
  };

  const onSubmit = async (data: Record<string, any>) => {
    try {
      const payload: Record<string, any> = { ...data, enquiry_type: enquiryType || 1 };
      
      // Include course_id if provided and enquiry type is 2 (Course)
      if (courseId && (enquiryType === 2 || enquiryType === "2")) {
        payload.course_id = courseId;
      } else {
        // Remove course_id if enquiry type is not 2
        delete payload.course_id;
      }
      
      await createEnquiry(payload);
      showSuccess(`${enquiryType === 1 || enquiryType === "1" ? "Enquiry" : "Course Enquiry"} sent successfully`);
      reset();
      onClose();
    } catch (err) {
      console.error("Enquiry error:", err);
      showError("Failed, please try again");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-[#087fc2]">
          Enquire Now
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("cstmr_name", { required: true, validate: validateName })}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.cstmr_name && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.cstmr_name.message)}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("cstmr_email", { validate: validateEmail })}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.cstmr_email && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.cstmr_email.message)}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("cstmr_phone", { required: true, validate: validatePhone })}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.cstmr_phone && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.cstmr_phone.message)}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Message
            </label>
            <textarea
              rows={4}
              {...register("cstmr_message")}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#1F67A5] to-[#087fc2] text-white py-2.5 cursor-pointer rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
