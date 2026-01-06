"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import { createRankForum } from "@/lib/api/rankForum";
import Select from "react-select";

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
            <p className="md:text-lg text-md text-gray-600 mb-8 leading-relaxed">
              At a time when the representation of educated individuals from the
              Malabar region in government services was extremely low, ACE was
              founded in 2008. With a strong sense of social commitment, this
              institution has so far enabled more than 25,000 candidates to
              enter various positions in government service. From LGS to KAS,
              and from LPST to College Lecturer, ACE alumni are serving in a
              wide range of government posts. The objective of this forum is to
              unite these former students and function collectively for the
              greater good.
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

  const START_YEAR = 2000;
  const CURRENT_YEAR = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: CURRENT_YEAR - START_YEAR + 1 },
    (_, i) => {
      const year = START_YEAR + i;
      return { label: String(year), value: String(year) };
    }
  );

  const officeOptions = [
    "Agriculture Department",
    "Akshaya State Project",
    "Animal Husbandry",
    "Archaeology",
    "Archives Department",
    "Bhoomikeralam Project",
    "Kerala State Electricity Board Ltd.",
    "Kerala Water Authority",
    "Kudumbashree- State Poverty Eradication Mission",
    "Directorate of Ayurveda Medical Education",
    "Co-operative Audit",
    "Co-operative Societies",
    "Commercial Taxes",
    "Commissionerate of Civil Supplies",
    "Directorate of Civil Supplies",
    "Commissioner for Entrance Examinations",
    "Census Operations- Kerala",
    "Coir Development",
    "Directorate of Culture",
    "Dairy Development Department",
    "Directorate of Handlooms and Textiles",
    "Directorate of Medical Education",
    "Directorate of Prosecution",
    "Drugs Control Department",
    "Directorate of Economics and Statistics",
    "Environment and Climate Change",
    "Collegiate Education",
    "Public Instructions",
    "Excise Commissionerate",
    "Directorate of Vocational Higher Secondary Education",
    "Grand Kerala Shopping Festival (GKSF)",
    "IT@school Project",
    "Electrical Inspectorate",
    "Inquiry Commissioner and Special Judge- Thiruvananthapuram",
    "Jalanidhi",
    "Factories and Boilers Department",
    "Fire and Rescue Services Department",
    "Fisheries Department",
    "Food Safety Commissioner",
    "Forest Department",
    "Ground Water Department",
    "Harbour Engineering Department",
    "Directorate of Health Services",
    "Directorate of Higher Secondary Education",
    "Homoeopathic Department",
    "Hydrographic Survey Wing",
    "Indian Systems of Medicine",
    "Industrial Tribunal and Judge",
    "Industries and Commerce Directorate",
    "Industries Training",
    "Information and Public Relations",
    "IMG (Institute of Management in Government)",
    "Insurance Medical Services Department",
    "Irrigation Department",
    "Jail Department",
    "KIRTADS",
    "Kuttanad Package",
    "Kerala Medical Services Corporation Limited",
    "Kerala Minerals and Metals Limited",
    "The Kerala State Co-Operative Bank Ltd.",
    "Kerala State Industrial Development Corporation Ltd.",
    "Kerala State IT Mission",
    "Kerala State Civil Supplies Corporation",
    "Kerala State Insurance Department",
    "Kerala State Land Use Board",
    "Kerala State Planning Board",
    "Kerala State Remote Sensing and Environment Centre",
    "Kerala State Roads and Bridges Development Corporation",
    "Kerala Tourism Development Corporation Limited",
    "Labour Commissionerate",
    "Land Board",
    "Commissionerate of Land Revenue",
    "Legal Metrology Department",
    "Kerala State Audit Department",
    "MGNREGS",
    "Mining and Geology Department",
    "Motor Vehicles Department",
    "Museums and Zoos Directorate",
    "NCC Directorate",
    "National Employment Service",
    "National Rural Health Mission (NRHM)",
    "Kerala State Nirmithi Kendra",
    "Panchayat Department",
    "Police Department",
    "Ports Department",
    "Printing Directorate",
    "Public Works Department",
    "Registration Department",
    "Rural Development",
    "Sarva Shiksha Abhiyan- Kerala",
    "Sainik Welfare Department",
    "Scheduled Caste Development Department",
    "Scheduled Tribe Development Department",
    "Social Justice Directorate",
    "Sports and Youth Affairs Department",
    "State Central Library Department",
    "State Water Transport Department",
    "Stationery Department",
    "Suchitwa Mission",
    "Survey and Land Records Department",
    "Town and Country Planning Department",
    "Tourism Department",
    "Treasuries Department",
    "Urban Affairs Department",
    "Vigilance and Anti-corruption Bureau",
    "Backward Communities Development Department",
    "Directorate of Minority Welfare",
  ].map((o) => ({ label: o, value: o }));

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
      course: "",
      batch: "",
      year_of_study: "",
      name_of_office: "",
      post: "",
      reg_no: "",
      joining_date: "",
      office_address: "",
    },
  });

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
      formData.append("course", data.course);
      formData.append("batch", data.batch);
      formData.append("year_of_study", data.year_of_study);
      formData.append("reg_no", data.reg_no);
      formData.append("name_of_office", data.name_of_office);
      formData.append("post", data.post);
      formData.append("joining_date", data.joining_date);
      formData.append("office_address", data.office_address);

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-[1px] overflow-hidden">
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
                type="tel"
                placeholder="1234567890"
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
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
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

            {/* course */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Course <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your course"
                {...register("course", {
                  required: "Category is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.course && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.course.message}
                </span>
              )}
            </div>

            {/* Batch */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Batch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter batch"
                {...register("batch", {
                  required: "Batch is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.batch && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.batch.message}
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

            {/* Registration Number */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Registration No: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter registration number"
                {...register("reg_no", {
                  required: "Registration number is required",
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.reg_no && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.reg_no.message}
                </span>
              )}
            </div>

            {/* Year */}
            <div className="">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <Select
                options={yearOptions}
                placeholder="Select Year"
                isSearchable
                menuPlacement="auto"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                    // border: "2px solid cyan"
                  }),

                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),

                  menuList: (base) => ({
                    ...base,
                    maxHeight: 180,
                    overflowY: "auto",
                  }),
                }}
                onChange={(opt) => {
                  setValue("year_of_study", opt?.value || "");
                  clearErrors("year_of_study");
                }}
              />
            </div>

            {/* Name of Office */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Name of Office <span className="text-red-500">*</span>
              </label>

              <Select
                options={officeOptions}
                placeholder="Select office"
                isSearchable
                menuPlacement="auto"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  menuList: (base) => ({
                    ...base,
                    maxHeight: 180,
                  }),
                }}
                onChange={(opt: any) => {
                  setValue("name_of_office", opt?.value || "");
                  clearErrors("name_of_office");
                }}
              />

              {/* Hidden input for react-hook-form */}
              <input
                type="hidden"
                {...register("name_of_office", {
                  required: "Office name is required",
                })}
              />

              {errors.name_of_office && (
                <span className="text-red-500 text-xs">
                  {errors.name_of_office.message}
                </span>
              )}
            </div>

            {/* Post */}
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Job Position <span className="text-red-500">*</span>
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

            {/* Address */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium text-sm">
                Office Address <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter office address"
                {...register("office_address", {
                  required: "Office address is required",
                  validate: validateText,
                })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.office_address && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.office_address.message}
                </span>
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
