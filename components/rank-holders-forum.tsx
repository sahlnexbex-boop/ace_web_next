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
              A special platform to recognize and celebrate the achievements of
              our outstanding rank holders. This forum provides an opportunity
              to connect, share experiences, and inspire upcoming students
              towards excellence.
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

  const studentPhoto = watch("student_photo");

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

      formData.append("student_name", data.student_name);
      formData.append("student_rank", data.student_rank);
      formData.append("based_type", data.based_type);
      formData.append("course_id", data.course_id || "0");
      formData.append("category_id", data.category_id || "0");
      formData.append("exam_name", data.exam_name);
      formData.append("joining_date", data.joining_date);
      formData.append("name_of_office", data.name_of_office);
      formData.append("place", data.place);
      formData.append("phone_no", data.phone_no);
      formData.append("year", String(data.year));

      if (data.student_photo && data.student_photo.length > 0) {
        const file: File = data.student_photo[0];
        formData.append("student_photo", file, file.name);
      } else {
        // If backend expects this field present even if empty, you may skip or send nothing
      }

      // Append fixed values
      formData.append("approval_status", "1");
      formData.append("status", "1");

      const res = await createRankHolder(formData);

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
    <div className="fixed inset-0 bg-black/50 z-50 flex backdrop-blur-[1px] items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={22} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-cyan-600 text-center">
          Apply for Rank Holder
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Student Name"
            {...register("student_name", { required: "Student name is required" })}
            className="border p-2 rounded"
          />
          {errors.student_name && <span className="text-red-500 text-sm col-span-2">{errors.student_name.message}</span>}

          <input
            type="text"
            placeholder="Student Rank"
            {...register("student_rank", {
              required: "Student rank is required",
              validate: validateStudentRank,
            })}
            className="border p-2 rounded"
          />
          {errors.student_rank && <span className="text-red-500 text-sm col-span-2">{errors.student_rank.message}</span>}

          <select
            {...register("based_type")}
            onChange={(e) => setBasedType(e.target.value)}
            className="border p-2 rounded col-span-2"
          >
            <option value="1">Course Based</option>
            <option value="2">Category Based</option>
          </select>

          {basedType === "1" && (
            <select
              {...register("course_id", { required: "Select a course" })}
              className="border p-2 rounded col-span-2"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_title || c.course_name}
                </option>
              ))}
            </select>
          )}
          {basedType === "2" && (
            <select
              {...register("category_id", { required: "Select a category" })}
              className="border p-2 rounded col-span-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Exam Name"
            {...register("exam_name", { required: "Exam name is required" })}
            className="border p-2 rounded"
          />
          {errors.exam_name && <span className="text-red-500 text-sm col-span-2">{errors.exam_name.message}</span>}

          <input
            type="date"
            {...register("joining_date", { required: "Joining date is required" })}
            className="border p-2 rounded"
          />
          {errors.joining_date && <span className="text-red-500 text-sm col-span-2">{errors.joining_date.message}</span>}

          <input
            type="text"
            placeholder="Name of Office"
            {...register("name_of_office", {
              required: "Office name is required",
              validate: validateOfficePlace,
            })}
            className="border p-2 rounded"
          />
          {errors.name_of_office && <span className="text-red-500 text-sm col-span-2">{errors.name_of_office.message}</span>}

          <input
            type="text"
            placeholder="Place"
            {...register("place", {
              required: "Place is required",
              validate: validateOfficePlace,
            })}
            className="border p-2 rounded"
          />
          {errors.place && <span className="text-red-500 text-sm col-span-2">{errors.place.message}</span>}

          <input
            type="text"
            placeholder="Phone Number"
            {...register("phone_no", { required: "Phone is required", validate: validatePhone })}
            className="border p-2 rounded"
          />
          {errors.phone_no && <span className="text-red-500 text-sm col-span-2">{errors.phone_no.message}</span>}

          <input
            type="number"
            placeholder="Year"
            {...register("year", { required: "Year is required", validate: validateYear })}
            className="border p-2 rounded"
          />
          {errors.year && <span className="text-red-500 text-sm col-span-2">{errors.year.message}</span>}

          <div className="col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">Student Photo</label>
            <input
              type="file"
              accept="image/*"
              {...register("student_photo", { required: "Student photo is required" })}
              className="border p-2 rounded w-full"
            />
            {errors.student_photo && (
              <span className="text-red-500 text-sm">{(errors.student_photo as any)?.message}</span>
            )}
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-[#00A0E3] hover:to-[#1F67A5] cursor-pointer text-white"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
