"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { getCourses } from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { createRankHolder } from "@/lib/api/rankHolders";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";

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

      {openModal && <RankHolderModal onClose={() => setOpenModal(false)} />}
    </section>
  );
}

function RankHolderModal({ onClose }: { onClose: () => void }) {
  const { showSuccess, showError } = useToast();

  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [basedType, setBasedType] = useState("1");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      student_name: "",
      student_rank: "",
      based_type: "1",
      course_id: "",
      category_id: "",
      exam_name: "",
      joining_date: "",
      name_of_office: "",
      place: "",
      phone_no: "",
      year: "",
      student_photo: null,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const [courseRes, categoryRes] = await Promise.all([
          getCourses(1, 100, ""),
          getCourseCategories(1, 100, ""),
        ]);
        setCourses(courseRes?.data || []);
        setCategories(categoryRes?.data || []);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    })();
  }, []);

  const validateStudentRank = (val: string) => {
    if (!/^\d+$/.test(val)) return "Rank must be numbers only";
    if (val.length > 5) return "Rank must be at most 5 digits";
    return true;
  };

  const validateYear = (val: string) => {
    const y = Number(val);
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(y)) return "Invalid year";
    if (y < 2000) return "Year must be 2000 or later";
    if (y > currentYear) return `Year cannot be in the future (${currentYear})`;
    return true;
  };

  const validatePhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length < 10) return "Phone must be at least 10 digits";
    if (digits.length > 17) return "Phone must be at most 17 digits";
    return true;
  };

  const validateOfficePlace = (val: string) => {
    if (!/^[A-Za-z0-9 .,'\-()]+$/.test(val)) return "Invalid characters";
    return true;
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();

      for (const key of Object.keys(data)) {
        if (key === "student_photo" && data.student_photo?.length > 0) {
          formData.append("student_photo", data.student_photo[0]);
        } else {
          formData.append(key, data[key]);
        }
      }

      formData.append("approval_status", "1");
      formData.append("status", "1");

      await createRankHolder(formData);
      showSuccess?.("Rank holder applied successfully!");
      reset();
      onClose();
    } catch (err) {
      console.error("Rank holder submit error:", err);
      showError?.("Failed, please try again");
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-cyan-600 text-center">
          Apply for Rank Holder
        </h3>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pr-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Student Name */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Student Name"
                {...register("student_name", {
                  required: "Student name is required",
                })}
                className="border p-2 rounded w-full"
              />
              {errors.student_name && (
                <span className="text-red-500 text-sm">
                  {errors.student_name.message}
                </span>
              )}
            </div>

            {/* Student Rank */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Student Rank"
                {...register("student_rank", {
                  required: "Student rank is required",
                  validate: validateStudentRank,
                })}
                className="border p-2 rounded w-full"
              />
              {errors.student_rank && (
                <span className="text-red-500 text-sm">
                  {errors.student_rank.message}
                </span>
              )}
            </div>

            {/* Based Type */}
            <div className="col-span-1 md:col-span-2">
              <select
                {...register("based_type")}
                onChange={(e) => setBasedType(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="1">Course Based</option>
                <option value="2">Category Based</option>
              </select>
            </div>

            {/* Conditional Select */}
            {basedType === "1" && (
              <div className="col-span-1 md:col-span-2">
                <select
                  {...register("course_id", { required: "Select a course" })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_title || c.course_name}
                    </option>
                  ))}
                </select>
                {errors.course_id && (
                  <span className="text-red-500 text-sm">
                    {errors.course_id.message}
                  </span>
                )}
              </div>
            )}

            {basedType === "2" && (
              <div className="col-span-1 md:col-span-2">
                <select
                  {...register("category_id", {
                    required: "Select a category",
                  })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <span className="text-red-500 text-sm">
                    {errors.category_id.message}
                  </span>
                )}
              </div>
            )}

            {/* Exam Name */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Exam Name"
                {...register("exam_name", {
                  required: "Exam name is required",
                })}
                className="border p-2 rounded w-full"
              />
              {errors.exam_name && (
                <span className="text-red-500 text-sm">
                  {errors.exam_name.message}
                </span>
              )}
            </div>

            {/* Joining Date */}
            <div className="col-span-1">
              <input
                type="date"
                {...register("joining_date", {
                  required: "Joining date is required",
                })}
                className="border p-2 rounded w-full"
              />
              {errors.joining_date && (
                <span className="text-red-500 text-sm">
                  {errors.joining_date.message}
                </span>
              )}
            </div>

            {/* Office Name */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Name of Office"
                {...register("name_of_office", {
                  required: "Office name is required",
                  validate: validateOfficePlace,
                })}
                className="border p-2 rounded w-full"
              />
              {errors.name_of_office && (
                <span className="text-red-500 text-sm">
                  {errors.name_of_office.message}
                </span>
              )}
            </div>

            {/* Place */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Place"
                {...register("place", {
                  required: "Place is required",
                  validate: validateOfficePlace,
                })}
                className="border p-2 rounded w-full"
              />
              {errors.place && (
                <span className="text-red-500 text-sm">
                  {errors.place.message}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Phone Number"
                {...register("phone_no", {
                  required: "Phone is required",
                  validate: validatePhone,
                })}
                className="border p-2 rounded w-full"
              />
              {errors.phone_no && (
                <span className="text-red-500 text-sm">
                  {errors.phone_no.message}
                </span>
              )}
            </div>

            {/* Year */}
            <div className="col-span-1">
              <input
                type="number"
                placeholder="Year"
                {...register("year", {
                  required: "Year is required",
                  validate: validateYear,
                })}
                className="border p-2 rounded w-full"
              />
              {errors.year && (
                <span className="text-red-500 text-sm">
                  {errors.year.message}
                </span>
              )}
            </div>

            {/* Student Photo */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">
                Student Photo
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("student_photo", {
                  required: "Student photo is required",
                })}
                className="border p-2 rounded w-full"
              />
              {errors.student_photo && (
                <span className="text-red-500 text-sm">
                  {(errors.student_photo as any)?.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-[#00A0E3] hover:to-[#1F67A5] text-white cursor-pointer"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
