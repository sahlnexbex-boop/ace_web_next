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
import { Switch } from "@/components/ui/switch";

interface ApplyOnlineModalProps {
  open: boolean;
  onClose: () => void;
  defaultDepartmentId?: string;
  defaultCourseId?: string;
  disableCourseSelection?: boolean;
  v2Connected?: boolean;
}

interface FormData {
  is_ace_student: boolean; // boolean toggle
  submit_type: string; // "register_only" | "online_payment"
  amount?: string;
  password?: string;
  branch_id: string;
  department_id: string;
  course_id: string;
  course_mode: string;
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
  student_photo?: FileList;
}

export default function ApplyOnlineModal({
  open,
  onClose,
  defaultDepartmentId,
  defaultCourseId,
  disableCourseSelection = false,
  v2Connected = true,
}: ApplyOnlineModalProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "custom">("full");
  const { showSuccess, showError } = useToast();
  const prefillInitialized = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      qualification: [],
      branch_id: "",
      department_id: "",
      course_id: "",
      course_mode: "",
      gender: "",
      marital_status: "",
      religion: "",
      community: "",
      district: "",
      is_ace_student: false,
      submit_type: "register_only",
      amount: "",
      password: "",
    },
  });

  const selectedDepartment = watch("department_id");
  const selectedCourseId = watch("course_id");
  const watchedPhoto = watch("student_photo");
  const isAceStudent = watch("is_ace_student");
  const submitType = watch("submit_type");
  const isOnlinePayment = submitType === "online_payment";

  // Clear validation errors for fields that get hidden when they are an Ace student
  useEffect(() => {
    if (isAceStudent) {
      clearErrors([
        "student_name",
        "password",
        "father_name",
        "date_of_birth",
        "gender",
        "marital_status",
        "religion",
        "community",
        "qualification",
        "house_name",
        "place",
        "district",
        "post_office",
        "pin_code",
        "second_phone_no",
        "student_photo",
      ]);
    }
  }, [isAceStudent, clearErrors]);

  // Derive available course modes from the selected course's course_type
  const selectedCourseObj = courses.find(
    (c: any) => String(c.course_id) === String(selectedCourseId)
  );

  const handlePaymentTypeChange = (value: "full" | "custom") => {
    setPaymentType(value);
    if (value === "full") {
      setValue("amount", selectedCourseObj?.course_fee ? String(selectedCourseObj.course_fee) : "");
      clearErrors("amount");
    } else {
      setValue("amount", "");
    }
  };

  // Auto-set amount to course fee when full payment is selected
  useEffect(() => {
    if (isOnlinePayment && paymentType === "full") {
      if (selectedCourseObj && selectedCourseObj.course_fee) {
        setValue("amount", String(selectedCourseObj.course_fee));
        clearErrors("amount");
      } else {
        setValue("amount", "");
      }
    }
  }, [selectedCourseId, selectedCourseObj, paymentType, isOnlinePayment, setValue, clearErrors]);

  const availableModes: { value: string; label: string }[] = (() => {
    if (!selectedCourseObj) return [];
    let types: number[] = [];
    if (Array.isArray(selectedCourseObj.course_type)) {
      types = selectedCourseObj.course_type;
    } else if (typeof selectedCourseObj.course_type === "string") {
      try {
        types = JSON.parse(selectedCourseObj.course_type);
      } catch {
        types = [];
      }
    }
    const modes: { value: string; label: string }[] = [];
    if (types.includes(1)) modes.push({ value: "Offline", label: "Offline" });
    if (types.includes(2)) modes.push({ value: "Online", label: "Online" });
    return modes;
  })();

  const isSingleMode = availableModes.length === 1;

  // Auto-set course_mode when only one mode is available, or reset when course changes
  useEffect(() => {
    if (availableModes.length === 1) {
      setValue("course_mode", availableModes[0].value);
    } else if (availableModes.length === 0) {
      setValue("course_mode", "");
    } else {
      // Multiple modes available — reset so user must pick
      const currentMode = watch("course_mode");
      if (currentMode && !availableModes.find((m) => m.value === currentMode)) {
        setValue("course_mode", "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId, courses]);

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
      setPaymentType("full");
    }
  }, [open]);

  // Load departments, branches, and courses on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const promises: Promise<any>[] = [
          getCourseCategories(1, 200, "", { v2_connected: "true" }),
          getBranches(1, 500, "", undefined, true),
        ];

        if (defaultDepartmentId) {
          promises.push(
            getCourses(1, 200, "", {
              category_id: defaultDepartmentId,
              v2_connected: "true",
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
        v2_connected: "true",
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

      const selectedBranchObj = branches.find(
        (b) => String(b.branch_id || b.id) === String(data.branch_id)
      );
      const selectedDeptObj = departments.find(
        (d) => String(d.category_id || d.id || d.department_id) === String(data.department_id)
      );
      const selectedCourseObj = courses.find(
        (c) => String(c.course_id || c.id) === String(data.course_id)
      );

      console.log("DEBUG ApplyOnlineModal onSubmit:", {
        data_course_id: data.course_id,
        courses_list_length: courses.length,
        selectedCourseObj,
        V2_course_val: selectedCourseObj?.V2_course || selectedCourseObj?.v2_course,
      });

      const v2BranchId = selectedBranchObj?.V2_branch ?? selectedBranchObj?.v2_branch ?? selectedBranchObj?.v2Branch ?? data.branch_id;
      const v2DeptId = selectedDeptObj?.V2_category ?? selectedDeptObj?.v2_category ?? selectedDeptObj?.v2Category ?? data.department_id;
      const v2CourseId = selectedCourseObj?.V2_course ?? selectedCourseObj?.v2_course ?? selectedCourseObj?.v2Course ?? data.course_id;

      const formData = new FormData();

      // Append general fields
      formData.append("branch_id", String(v2BranchId));
      formData.append("department_id", String(v2DeptId));
      formData.append("course_id", String(v2CourseId));
      formData.append("course_mode", data.course_mode);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("is_ace_student", String(isAceStudent));
      formData.append("is_online_payment", String(isOnlinePayment));
      formData.append("amount", isOnlinePayment ? String(data.amount || "") : "");
      if (isOnlinePayment) {
        formData.append("callback_url", process.env.NEXT_PUBLIC_RAZORPAY_CALLBACK || "http://localhost:3000/transaction-complete");
      }

      // Append other fields only if NOT an Ace student
      if (!isAceStudent) {
        formData.append("student_name", data.student_name);
        formData.append("password", data.password || "");
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
        formData.append("post_office", data.post_office || "");
        formData.append("pin_code", data.pin_code);
        formData.append("second_phone_no", data.second_phone_no || "");

        // Append file if exists
        if (data.student_photo && data.student_photo.length > 0) {
          formData.append("student_photo", data.student_photo[0]);
        }
      }

      const res = await createOnlineRegistration(formData);

      if (isOnlinePayment) {
        if (res?.payment_url) {
          window.open(res.payment_url, "_blank");
          showSuccess("success", "Your Registration is Completed. Redirecting to payment...");
        } else {
          showSuccess("success", "Your Registration is Completed.");
        }
      } else {
        showSuccess("success", "Your Registration is Completed");
      }

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

  const handleRemovePhoto = () => {
    setValue("student_photo", undefined);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    reset();
    setDepartments([]);
    setCourses([]);
    setBranches([]);
    setPhotoPreview(null);
    setPaymentType("full");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!open) return null;

  if (!v2Connected) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
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

          <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">Admission Not Available</h3>
              <p className="text-gray-600 max-w-md mx-auto text-base">
                This course Admission not Available Now! Please Contact Office or - <span className="font-semibold text-cyan-600">9995076789</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-2.5 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Already Ace student ? */}
            <div className="md:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 mb-2">
              <div>
                <label className="block text-sm font-semibold text-cyan-700">
                  Already Ace student ?
                </label>
                <p className="text-xs text-gray-500">
                  Toggle on if you are currently or have previously been a student at Ace Institutions.
                </p>
              </div>
              <Controller
                name="is_ace_student"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

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

            {/* Course Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Mode
              </label>
              <Controller
                name="course_mode"
                control={control}
                rules={{ required: "Course mode is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isSingleMode}
                  >
                    <SelectTrigger className={`w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      (!selectedCourseId || availableModes.length === 0) ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                    } ${
                      isSingleMode ? "opacity-70 cursor-not-allowed" : ""
                    }`}>
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {availableModes.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
              {errors.course_mode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course_mode.message}
                </p>
              )}
            </div>

            {!isAceStudent && (
              <>
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    {...register("student_name", {
                      required: !isAceStudent ? "Student name is required" : false,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {errors.student_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.student_name.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: !isAceStudent ? "Password is required" : false,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
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
                      required: !isAceStudent ? "Father name is required" : false,
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
                      required: !isAceStudent ? "Date of birth is required" : false,
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
                    rules={{ required: !isAceStudent ? "Gender is required" : false }}
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
                    rules={{ required: !isAceStudent ? "Marital status is required" : false }}
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
                    rules={{ required: !isAceStudent ? "Religion is required" : false }}
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
                    rules={{ required: !isAceStudent ? "Community is required" : false }}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>

                  <Controller
                    name="qualification"
                    control={control}
                    rules={{ required: !isAceStudent ? "At least one qualification is required" : false }}
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
                      required: !isAceStudent ? "House name is required" : false,
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
                    {...register("place", { required: !isAceStudent ? "Place is required" : false })}
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
                    rules={{ required: !isAceStudent ? "District is required" : false }}
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
                      required: !isAceStudent ? "Post office is required" : false,
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
                      required: !isAceStudent ? "Pin code is required" : false,
                      pattern: !isAceStudent ? {
                        value: /^[0-9]{6}$/,
                        message: "Pin code must be 6 digits",
                      } : undefined,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {errors.pin_code && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pin_code.message}
                    </p>
                  )}
                </div>
              </>
            )}

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
                {isAceStudent ? "Registered Phone Number" : "Phone Number"}
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
            {!isAceStudent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Phone Number
                </label>
                <input
                  type="tel"
                  {...register("second_phone_no", {
                    pattern: !isAceStudent ? {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    } : undefined,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {errors.second_phone_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.second_phone_no.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submit Type
              </label>
              <Controller
                name="submit_type"
                control={control}
                rules={{ required: "Submit type is required" }}
                render={({ field }) => (
                  <ShadcnSelect
                    value={field.value || "register_only"}
                    onValueChange={(val) => {
                      field.onChange(val);
                      if (val !== "online_payment") {
                        setValue("amount", "");
                        clearErrors("amount");
                      } else {
                        setPaymentType("full");
                        setValue("amount", selectedCourseObj?.course_fee ? String(selectedCourseObj.course_fee) : "");
                        clearErrors("amount");
                      }
                    }}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Submit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="register_only">Register only</SelectItem>
                      <SelectItem value="online_payment">Online payment</SelectItem>
                    </SelectContent>
                  </ShadcnSelect>
                )}
              />
              {errors.submit_type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.submit_type.message}
                </p>
              )}
            </div>

            {/* Course Fee Display */}
            {isOnlinePayment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Fee
                </label>
                <div className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600 flex items-center font-semibold">
                  {selectedCourseObj?.course_fee 
                    ? `₹ ${selectedCourseObj.course_fee}` 
                    : "Select a course to view fee"}
                </div>
              </div>
            )}

            {/* Payment Option */}
            {isOnlinePayment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Option
                </label>
                <ShadcnSelect
                  value={paymentType}
                  onValueChange={(val: "full" | "custom") => handlePaymentTypeChange(val)}
                >
                  <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <SelectValue placeholder="Select Payment Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Payment</SelectItem>
                    <SelectItem value="custom">Custom Amount</SelectItem>
                  </SelectContent>
                </ShadcnSelect>
              </div>
            )}

            {/* Amount */}
            {isOnlinePayment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  readOnly={paymentType === "full"}
                  placeholder={paymentType === "full" ? "Auto-filled" : "Enter amount"}
                  {...register("amount", {
                    required: isOnlinePayment ? "Amount is required" : false,
                    validate: {
                      minAmount: (val) => {
                        if (!isOnlinePayment) return true;
                        const num = parseFloat(val || "0");
                        if (num < 100) {
                          return "Amount must be at least ₹100";
                        }
                        return true;
                      },
                      maxAmount: (val) => {
                        if (!isOnlinePayment) return true;
                        const num = parseFloat(val || "0");
                        const maxFee = selectedCourseObj?.course_fee ? parseFloat(selectedCourseObj.course_fee) : 0;
                        if (maxFee && num > maxFee) {
                          return `Amount cannot exceed the course fee of ₹${maxFee}`;
                        }
                        return true;
                      },
                    }
                  })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    paymentType === "full" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800"
                  }`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            )}

            {/* Student Photo with Preview */}
            {!isAceStudent && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Photo
                </label>

                {(() => {
                  const { ref: registerRef, ...rest } = register("student_photo");
                  return (
                    <input
                      type="file"
                      accept="image/*"
                      {...rest}
                      ref={(e) => {
                        registerRef(e);
                        fileInputRef.current = e;
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  );
                })()}

                {photoPreview && (
                  <div className="mt-3 flex justify-start">
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden shadow-sm">
                      <img
                        src={photoPreview}
                        alt="Student Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer shadow-md transition-all duration-200"
                        title="Remove photo"
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
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
            {!isOnlinePayment ? (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 cursor-pointer bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register only"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 cursor-pointer bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-md hover:from-emerald-600 hover:to-teal-600 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
