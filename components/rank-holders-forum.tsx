"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import { createRankForum } from "@/lib/api/rankForum";
import { getCourseCategories } from "@/lib/api/courseCategory";

const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export default function RankHoldersForum() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const polygon1Ref = useRef<HTMLImageElement | null>(null);
  const polygon2Ref = useRef<HTMLImageElement | null>(null);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo(
            polygon1Ref.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8 }
          ).fromTo(
            polygon2Ref.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.8 },
            "-=0.7"
          );
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 bg-[#098B9F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Rank Holders Forum
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our students are our pride and inspiration. By consistently
              securing top ranks, they stand as a testament to the quality of
              our education, dedicated faculty guidance and unwavering support
              we offer to each student. We at ACE strongly believe dreams
              shouldn't be hindered by distance. Our PSC coaching app ensures
              that you get to prepare at the comfort of your home. With
              carefully curated syllabus and training methods we have emerged as
              the best online psc coaching centre in Kerala. Our student success
              stories from all over Kerala proves that distance is no barrier
              when education is done right.
            </p>
            <Button
              size="lg"
              onClick={() => setOpenModal(true)}
              className="cursor-pointer bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:opacity-90 text-white px-8 py-3"
            >
              Apply Now
            </Button>
          </div>

          <div className="relative flex justify-end">
            <img
              ref={polygon1Ref}
              src="/polygon_01.png"
              alt="shapes"
              className="absolute top-5 left-0"
            />
            <img
              ref={polygon2Ref}
              src="/polygon_02.png"
              alt="shapes"
              className="absolute top-0 right-52"
            />
            <img src="/logo_rotated.png" alt="" className="absolute top-0" />
            <div className="relative z-10">
              <img
                src="/form_globe.png"
                alt="Educational success"
                className="md:max-w-[450px] md:max-h-[450px] max-w-[320px] max-h-[320px]"
              />
            </div>
          </div>
        </div>
      </div>

      {openModal && <RankForumModal onClose={() => setOpenModal(false)} />}
    </section>
  );
}

function RankForumModal({ onClose }: { onClose: () => void }) {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      mobile_no: "",
      email: "",
      rank: "",
      category: "",
      name_of_office: "",
      post: "",
      district: "",
      joining_date: "",
      photo: null,
    },
  });

  const photoField = watch("photo");

  const removeSelectedImage = () => {
    setValue("photo", null);
    clearErrors("photo");
    setImagePreview(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const categoryRes = await getCourseCategories(1, 100, "");
        setCategories(categoryRes?.data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (photoField && photoField.length > 0) {
      const file = photoField[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [photoField]);

  const validatePhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length < 10) return "Phone must be at least 10 digits";
    if (digits.length > 17) return "Phone must be at most 17 digits";
    return true;
  };

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Invalid email address";
    return true;
  };

  const validateText = (val: string) => {
    if (!/^[A-Za-z0-9 .,'\-()]+$/.test(val)) return "Invalid characters";
    return true;
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("mobile_no", data.mobile_no);
      formData.append("email", data.email);
      formData.append("rank", data.rank);
      formData.append("department_id", data.category);
      formData.append("name_of_office", data.name_of_office);
      formData.append("post", data.post);
      formData.append("district", data.district);
      formData.append("joining_date", data.joining_date);

      if (data.photo?.length > 0) {
        formData.append("photo", data.photo[0]);
      }

      await createRankForum(formData);
      showSuccess?.("Application submitted successfully!");
      reset();
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error("Rank forum submit error:", err);
      showError?.("Failed to submit application, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-[1px]">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative p-5 sm:p-6 flex flex-col"
        style={{
          maxHeight: "90vh",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={22} />
        </button>

        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-cyan-600 text-center">
          Apply for Rank Holder
        </h3>

        <div className="overflow-y-auto flex-1 px-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Mobile Number */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter mobile number"
                {...register("mobile_no", {
                  required: "Mobile number is required",
                  validate: validatePhone,
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.mobile_no && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.mobile_no.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  validate: validateEmail,
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Rank */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Rank <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your rank"
                {...register("rank", {
                  required: "Rank is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.rank && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.rank.message}
                </span>
              )}
            </div>

            {/* Category (Department) */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", {
                  required: "Category is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Name of Office */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Name of Office <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter office name"
                {...register("name_of_office", {
                  required: "Office name is required",
                  validate: validateText,
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.name_of_office && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.name_of_office.message}
                </span>
              )}
            </div>

            {/* Post */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Post <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter post"
                {...register("post", {
                  required: "Post is required",
                  validate: validateText,
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.post && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.post.message}
                </span>
              )}
            </div>

            {/* District */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                District <span className="text-red-500">*</span>
              </label>
              <select
                {...register("district", {
                  required: "District is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select District</option>
                {KERALA_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.district.message}
                </span>
              )}
            </div>

            {/* Joining Date */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("joining_date", {
                  required: "Joining date is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.joining_date && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.joining_date.message}
                </span>
              )}
            </div>

            {/* Photo */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Photo <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("photo", {
                  required: "Photo is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.photo && (
                <span className="text-red-500 text-xs mt-1">
                  {(errors.photo as any)?.message}
                </span>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 flex justify-start">
                  <div className="relative inline-block  max-w-20 max-h-20">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-fullobject-cover rounded-lg border-2 border-gray-300 shadow-md"
                    />
                    <div
                      onClick={removeSelectedImage}
                      className="absolute -top-2 -right-2 bg-red-600 cursor-pointer text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                    >
                      ✕
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-[#00A0E3] hover:to-[#1F67A5] text-white cursor-pointer px-8"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
