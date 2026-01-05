"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getScholarshipExams } from "@/lib/api/scholarshipExam";
import { createExamRegistration } from "@/lib/api/examRegistration";
import { useToast } from "@/contexts/ToastContext";

/* ================= BRANCH OPTIONS ================= */
const BRANCH_OPTIONS = [
  { label: "BALUSSERY - BLS", value: "BLS" },
  { label: "CALICUT - CLT", value: "CLT" },
  { label: "EDAPPAL - EDP", value: "EDP" },
  { label: "MALAPPURAM - MLP", value: "MLP" },
  { label: "MANJERI - MJI", value: "MJI" },
  { label: "NILAMBUR - NLB", value: "NLB" },
  { label: "PALAKKAD - PKD", value: "PKD" },
  { label: "PATTAMBI - PTB", value: "PTB" },
  { label: "PERINTHALMANNA - PTM", value: "PTM" },
  { label: "TIRUR - TR", value: "TR" },
];

const initialFormState = {
  name: "",
  mobile: "",
  email: "",
  date_of_birth: "",
  branch: "",
  address: "",
  is_ace_std: 0,
};

export default function ExamRegisterPage() {
  const { id } = useParams();
  const numericExamId = Number(id);
  const std_id = localStorage.getItem("std_id");

  const [form, setForm] = useState(initialFormState);
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showSuccess, showError } = useToast();

  /* ================= FETCH EXAMS & MATCH URL ID ================= */
  useEffect(() => {
    if (!numericExamId) return;

    const fetchExam = async () => {
      try {
        const res = await getScholarshipExams(1, 50, "", 1);
        const exams = res?.data || [];

        const matchedExam = exams.find((e: any) => e.exam_id === numericExamId);

        if (!matchedExam) {
          setError("Invalid exam link");
          return;
        }

        setExam(matchedExam);
      } catch {
        setError("Failed to load exam details");
      }
    };

    fetchExam();
  }, [numericExamId]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.name) return "Name is required";
    if (!/^\d{10}$/.test(form.mobile)) return "Mobile number must be 10 digits";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email))
      return "Only Gmail addresses are allowed";
    if (!form.branch) return "Please select a branch";
    return "";
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      await createExamRegistration({
        ...form,
        exam_id: exam.exam_id,
        std_id: Number(std_id),
      });

      showSuccess("Registration successful");
      setForm(initialFormState);
    } catch (e: any) {
      showError(e?.message || "Registration failed");
      setError(e?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING / ERROR STATES ================= */
  if (error && !exam) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center">
        Loading exam details...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto my-14 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-cyan-800">
          Exam Registration
        </h2>
        <p className="text-sm text-gray-500 mt-1">{exam.exam_title}</p>
      </div>

      {/* Form */}
      <div className="p-6 space-y-4 grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* {error && (
          <p className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm">
            {error}
          </p>
        )} */}

        <div className="mb-0">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            placeholder="John Doe"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-0">
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            placeholder="9876543210"
            className="input"
            type="tel"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
        </div>

        <div className="mb-0">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            placeholder="example@gmail.com"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-0">
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            className="input"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
          />
        </div>

        <div className="mb-0">
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <select
            className="input"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            <option value="">Select Branch</option>
            {BRANCH_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-0">
          <label className="block text-sm font-medium text-gray-700">
            Exam
          </label>
          <input
            className="input bg-gray-100 cursor-not-allowed"
            value={exam.exam_title}
            disabled
          />
        </div>

        <div className="md:col-span-2 mb-0">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            placeholder="Enter your address"
            className="input h-24"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        {/* ACE Student */}
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.is_ace_std === 1}
            onChange={(e) =>
              setForm({ ...form, is_ace_std: e.target.checked ? 1 : 0 })
            }
            className="cursor-pointer ms-2 scale-150"
          />
          I am an ACE student
        </label>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t flex justify-end">
        <button
          onClick={submit}
          disabled={loading}
          className="px-6 py-2 cursor-pointer bg-gradient-to-r from-cyan-700 to-sky-600 text-white rounded-lg hover:scale-110 transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
