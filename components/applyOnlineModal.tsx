"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IconX } from "@tabler/icons-react";
import { createOnlineRegistration } from "@/lib/api/registration";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { getCourses } from "@/lib/api/course";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";

interface ApplyOnlineModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  branch: string;
  department_id: string;
  course_id: string;
  student_name: string;
  father_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  religion: string;
  community: string;
  qualification: string[];
  house_name: string;
  place: string;
  district: string;
  post_office: string;
  pin_code: string;
  email: string;
  phone_number: string;
  second_phone_no: string;
  message: string;
  student_photo?: FileList;
}

export default function ApplyOnlineModal({
  open,
  onClose,
}: ApplyOnlineModalProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      qualification: [],
    },
  });

  const selectedDepartment = watch("department_id");
  const watchedPhoto = watch("student_photo");

  useEffect(() => {
    if (watchedPhoto && watchedPhoto.length > 0) {
      const file = watchedPhoto[0];
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPhotoPreview(null);
    }
  }, [watchedPhoto]);

  // Load departments on mount
  useEffect(() => {
    const loadDepartments = async () => {
      const res = await getCourseCategories(1, 200, "");
      setDepartments(res?.data || []);
    };
    loadDepartments();
  }, []);

  // Load courses when department changes
  useEffect(() => {
    const loadCourses = async () => {
      if (!selectedDepartment) {
        setCourses([]);
        setValue("course_id", "");
        return;
      }

      const res = await getCourses(1, 200, "", {
        category_id: selectedDepartment,
      });
      setCourses(res?.data || []);
    };

    loadCourses();
  }, [selectedDepartment, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setSuccessMessage("");

      const formData = new FormData();

      // Append all text fields
      formData.append("branch", data.branch);
      formData.append("department_id", data.department_id);
      formData.append("course_id", data.course_id);
      formData.append("student_name", data.student_name);
      formData.append("father_name", data.father_name);
      formData.append("date_of_birth", data.date_of_birth);
      formData.append("gender", data.gender);
      formData.append("marital_status", data.marital_status);
      formData.append("religion", data.religion);
      formData.append("community", data.community);
      formData.append("qualification", JSON.stringify(data.qualification));
      formData.append("house_name", data.house_name);
      formData.append("place", data.place);
      formData.append("district", data.district);
      formData.append("post_office", data.post_office);
      formData.append("pin_code", data.pin_code);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("second_phone_no", data.second_phone_no || "");
      formData.append("message", data.message || "");

      // Append file if exists
      if (data.student_photo && data.student_photo.length > 0) {
        formData.append("student_photo", data.student_photo[0]);
      }

      await createOnlineRegistration(formData);

      showSuccess("success", "Application submitted!");
      reset();
      setPhotoPreview(null);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error submitting application:", error);
      showError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setPhotoPreview(null);
    setSuccessMessage("");
    onClose();
  };

  if (!open) return null;

  const BRANCH_OPTIONS = [
    "BALUSSERY",
    "CALICUT",
    "EDAPPAL",
    "MALAPPURAM",
    "MANJERI",
    "NILAMBUR",
    "PALAKKAD",
    "PATTAMBI",
    "PERINTHALMANNA",
    "TIRUR",
  ];

  const DISTRICT_OPTIONS = [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ];

  const RELIGION_OPTIONS = [
    "Hindu",
    "Islam",
    "Sikh",
    "Christian",
    "Buddhist",
    "Jain",
    "Parsi",
    "Other",
  ];

  const COMMUNITY_OPTIONS = [
    "GEN",
    "Ezhava",
    "SC",
    "ST",
    "Muslim",
    "LC/AL",
    "OBC",
    "Vishwakarma",
    "Nadar",
    "OX",
    "Dheevara",
    "Other",
  ];

  const QUALIFICATION_OPTIONS = [
    "Phd",
    "MPhil",
    "PG",
    "B.Ed",
    "Degree",
    "Diploma",
    "TTC",
    "ITI/ITC",
    "+2",
    "SSLC",
    "Others",
  ];

  const QUALIFICATION_SELECT_OPTIONS = QUALIFICATION_OPTIONS.map((q) => ({
    label: q,
    value: q,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col mt-20">
        {/* Header */}
        <div className="flex items-center justify-between md:px-6 px-3 py-4 border-b">
          <h2 className="text-2xl font-semibold text-cyan-700">
            Online Registration
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer group"
          >
            <IconX className="h-7 w-7 group-hover:scale-120" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto flex-1 md:p-6 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <select
                {...register("branch", { required: "Branch is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Branch</option>
                {BRANCH_OPTIONS.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.branch.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                {...register("department_id", {
                  required: "Department is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.category_id} value={dept.category_id}>
                    {dept.category_name}
                  </option>
                ))}
              </select>
              {errors.department_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.department_id.message}
                </p>
              )}
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                {...register("course_id", { required: "Course is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={!selectedDepartment || courses.length === 0}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
              {errors.course_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course_id.message}
                </p>
              )}
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                {...register("student_name", {
                  required: "Student name is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.student_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.student_name.message}
                </p>
              )}
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father Name
              </label>
              <input
                type="text"
                {...register("father_name", {
                  required: "Father name is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.father_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.father_name.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("date_of_birth", {
                  required: "Date of birth is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status
              </label>
              <select
                {...register("marital_status", {
                  required: "Marital status is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
              {errors.marital_status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.marital_status.message}
                </p>
              )}
            </div>

            {/* Religion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Religion
              </label>
              <select
                {...register("religion", { required: "Religion is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Religion</option>
                {RELIGION_OPTIONS.map((religion) => (
                  <option key={religion} value={religion}>
                    {religion}
                  </option>
                ))}
              </select>
              {errors.religion && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.religion.message}
                </p>
              )}
            </div>

            {/* Community */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Community
              </label>
              <select
                {...register("community", {
                  required: "Community is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Community</option>
                {COMMUNITY_OPTIONS.map((community) => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </select>
              {errors.community && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.community.message}
                </p>
              )}
            </div>

            {/* Qualification - Multi Select (react-select) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification
              </label>

              <Controller
                name="qualification"
                control={control}
                rules={{ required: "At least one qualification is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={QUALIFICATION_SELECT_OPTIONS}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="Select qualification(s)"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    value={QUALIFICATION_SELECT_OPTIONS.filter((opt) =>
                      field.value?.includes(opt.value)
                    )}
                    onChange={(selected) =>
                      field.onChange(selected.map((item) => item.value))
                    }
                  />
                )}
              />

              {errors.qualification && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.qualification.message}
                </p>
              )}
            </div>

            {/* House Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House Name
              </label>
              <input
                type="text"
                {...register("house_name", {
                  required: "House name is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.house_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.house_name.message}
                </p>
              )}
            </div>

            {/* Place */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place
              </label>
              <input
                type="text"
                {...register("place", { required: "Place is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.place && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.place.message}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <select
                {...register("district", { required: "District is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select District</option>
                {DISTRICT_OPTIONS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>

            {/* Post Office */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Office
              </label>
              <input
                type="text"
                {...register("post_office", {
                  required: "Post office is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.post_office && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.post_office.message}
                </p>
              )}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Code
              </label>
              <input
                type="text"
                {...register("pin_code", {
                  required: "Pin code is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Pin code must be 6 digits",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.pin_code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pin_code.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone_number", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            {/* Second Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Second Phone Number
              </label>
              <input
                type="tel"
                {...register("second_phone_no", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.second_phone_no && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.second_phone_no.message}
                </p>
              )}
            </div>

            {/* Student Photo with Preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Photo
              </label>

              <input
                type="file"
                accept="image/*"
                {...register("student_photo")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              {photoPreview && (
                <div className="mt-3 flex justify-start">
                  <div className="relative w-32 h-32 border rounded-md overflow-hidden shadow-sm">
                    <img
                      src={photoPreview}
                      alt="Student Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Any additional information..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
