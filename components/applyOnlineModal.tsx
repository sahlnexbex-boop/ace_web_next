"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { IconX } from "@tabler/icons-react";
import { createOnlineRegistration } from "@/lib/api/registration";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { getCourses } from "@/lib/api/course";
import { getBranches } from "@/lib/api/branches";
import ReactSelect from "react-select";
import { useToast } from "@/contexts/ToastContext";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplyOnlineModalProps {
  open: boolean;
  onClose: () => void;
  defaultDepartmentId?: string;
  defaultCourseId?: string;
  disableCourseSelection?: boolean;
}

interface FormData {
  branch_id: string;
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
  defaultDepartmentId,
  defaultCourseId,
  disableCourseSelection = false,
}: ApplyOnlineModalProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const prefillInitialized = useRef(false);

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
      branch_id: "",
      department_id: "",
      course_id: "",
      gender: "",
      marital_status: "",
      religion: "",
      community: "",
      district: "",
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

  // Reset prefill flag on modal open
  useEffect(() => {
    if (open) {
      prefillInitialized.current = false;
    }
  }, [open]);

  // Load departments, branches, and courses on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const promises: Promise<any>[] = [
          getCourseCategories(1, 200, ""),
          getBranches(1, 500),
        ];

        if (defaultDepartmentId) {
          promises.push(
            getCourses(1, 200, "", {
              category_id: defaultDepartmentId,
            })
          );
        }

        const results = await Promise.all(promises);
        const deptRes = results[0];
        const branchRes = results[1];
        const courseRes = results[2];

        setDepartments(deptRes?.data || []);
        setBranches(branchRes?.data || []);

        if (courseRes) {
          setCourses(courseRes?.data || []);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };
    if (open) {
      loadInitialData();
    }
  }, [open, defaultDepartmentId]);

  // Set default prefilled fields once options are loaded in state
  useEffect(() => {
    if (open && departments.length > 0 && !prefillInitialized.current) {
      if (defaultDepartmentId) {
        setValue("department_id", String(defaultDepartmentId));
      }

      if (defaultCourseId) {
        if (courses.length > 0) {
          setValue("course_id", String(defaultCourseId));
          prefillInitialized.current = true;
        }
      } else {
        prefillInitialized.current = true;
      }
    }
  }, [open, departments, courses, defaultDepartmentId, defaultCourseId, setValue]);

  // Load courses when department changes
  useEffect(() => {
    const loadCourses = async () => {
      // If course selection is locked, we do not need dynamic loading on department change
      if (disableCourseSelection) {
        return;
      }

      if (!selectedDepartment) {
        setCourses([]);
        setValue("course_id", "");
        return;
      }

      const res = await getCourses(1, 200, "", {
        category_id: selectedDepartment,
      });
      const loadedCourses = res?.data || [];
      setCourses(loadedCourses);
      setValue("course_id", "");
    };

    loadCourses();
  }, [selectedDepartment, setValue, disableCourseSelection]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append all text fields
      formData.append("branch_id", data.branch_id);
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
    setDepartments([]);
    setCourses([]);
    setBranches([]);
    setPhotoPreview(null);
    onClose();
  };

  if (!open) return null;

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
              <Controller
                name="branch_id"
                control={control}
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {branches.map((b) => (
                        <SelectItem key={b.branch_id} value={String(b.branch_id)}>
                          {b.branch_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
              {errors.branch_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.branch_id.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Controller
                name="department_id"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      disableCourseSelection ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                    }`}>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {departments.map((dept) => (
                        <SelectItem key={dept.category_id} value={String(dept.category_id)}>
                          {dept.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
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
              <Controller
                name="course_id"
                control={control}
                rules={{ required: "Course is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      (disableCourseSelection || !selectedDepartment || courses.length === 0) ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                    }`}>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {courses.map((course) => (
                        <SelectItem key={course.course_id} value={String(course.course_id)}>
                          {course.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
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
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
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
              <Controller
                name="marital_status"
                control={control}
                rules={{ required: "Marital status is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
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
              <Controller
                name="religion"
                control={control}
                rules={{ required: "Religion is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Religion" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {RELIGION_OPTIONS.map((religion) => (
                        <SelectItem key={religion} value={religion}>
                          {religion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
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
              <Controller
                name="community"
                control={control}
                rules={{ required: "Community is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Community" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {COMMUNITY_OPTIONS.map((community) => (
                        <SelectItem key={community} value={community}>
                          {community}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
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
                  <ReactSelect
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
              <Controller
                name="district"
                control={control}
                rules={{ required: "District is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {DISTRICT_OPTIONS.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
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
              className="px-6 py-2 cursor-pointer bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
