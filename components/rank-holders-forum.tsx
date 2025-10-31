"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { getCourses } from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { createRankHolder } from "@/lib/api/rankHolders";
import { X } from "lucide-react";

export default function RankHoldersForum() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const polygon1Ref = useRef<HTMLImageElement | null>(null);
  const polygon2Ref = useRef<HTMLImageElement | null>(null);

  const [openModal, setOpenModal] = useState(false);

  // Animation when section appears
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.fromTo(
            polygon1Ref.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8 }
          );

          tl.fromTo(
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

          {/* Right illustration */}
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

// =========================
// Modal Component
// =========================
function RankHolderModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
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
    student_photo: null as File | null,
  });

  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Proper API calls (based on your provided format)
  useEffect(() => {
    (async () => {
      try {
        const [courseRes, categoryRes] = await Promise.all([
          getCourses(1, 100, ""),
          getCourseCategories(1, 100, ""),
        ]);

        setCourses(courseRes?.data || courseRes?.rows || courseRes || []);
        setCategories(
          categoryRes?.data || categoryRes?.rows || categoryRes || []
        );
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, student_photo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // ✅ Append all fields properly
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, String(value));
      });

      formData.append("approval_status", "1");
      formData.append("status", "1");

      if (form.student_photo) {
        formData.set("student_photo", form.student_photo);
      }

      await createRankHolder(formData);
      alert("✅ Rank Holder submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex backdrop-blur-[1px]  items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 cursor-pointer hover:scale-120 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-cyan-600 text-center">
          Apply for Rank Holder
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="student_name"
            placeholder="Student Name"
            value={form.student_name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="student_rank"
            placeholder="Student Rank"
            value={form.student_rank}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          {/* Based Type */}
          <select
            name="based_type"
            value={form.based_type}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          >
            <option value="1">Course Based</option>
            <option value="2">Category Based</option>
          </select>

          {/* Conditional selects */}
          {form.based_type === "1" && (
            <select
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
              required
              className="border p-2 rounded col-span-2"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_title || course.course_name}
                </option>
              ))}
            </select>
          )}

          {form.based_type === "2" && (
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
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

          {/* Other fields */}
          <input
            type="text"
            name="exam_name"
            placeholder="Exam Name"
            value={form.exam_name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="joining_date"
            value={form.joining_date}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="name_of_office"
            placeholder="Name of Office"
            value={form.name_of_office}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="place"
            placeholder="Place"
            value={form.place}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="phone_no"
            placeholder="Phone Number"
            value={form.phone_no}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          {/* File upload */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Student Photo
            </label>
            <input
              type="file"
              name="student_photo"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Submit */}
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
