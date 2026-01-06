"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getScholarshipExams } from "@/lib/api/scholarshipExam";
import { getStudentById } from "@/lib/api/student";
import {
  createExamRegistration,
  getExamRegistrations,
} from "@/lib/api/examRegistration";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

// branch options
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
  const router = useRouter();

  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);
  const [countdown, setCountdown] = useState(10);
  const [studentEmail, setStudentEmail] = useState("");

  const { showSuccess, showError } = useToast();

  const Info = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: any;
    highlight?: boolean;
  }) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`font-medium ${
          highlight ? "text-cyan-700" : "text-gray-800"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );

  useEffect(() => {
    if (!exam || !std_id) return;

    const checkRegistration = async () => {
      try {
        const res = await getExamRegistrations(
          1,
          50,
          "",
          undefined,
          Number(std_id)
        );

        const match = res?.data?.find((r: any) => r.exam_id === exam.exam_id);

        if (match) {
          setAlreadyRegistered(true);
          setRegisteredData(match);
        }
      } catch (err) {
        console.error("Registration check failed", err);
      }
    };

    checkRegistration();
  }, [exam, std_id]);

  useEffect(() => {
    if (!std_id) return;

    const fetchStudent = async () => {
      try {
        const res = await getStudentById(Number(std_id));
        const student = res?.data;

        if (student?.std_email) {
          setStudentEmail(student.std_email);
        }
      } catch (err) {
        console.error("Failed to fetch student details", err);
      }
    };

    fetchStudent();
  }, [std_id]);

  useEffect(() => {
    if (!alreadyRegistered) return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push("/user-portal/protected/my-exams");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alreadyRegistered, router]);

  //   FETCH EXAM
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

  //   VALIDATE FORM
  const validate = () => {
    if (!form.name) return "Name is required";
    if (!/^\d{10}$/.test(form.mobile)) return "Mobile number must be 10 digits";
    // if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email))
    //   return "Only Gmail addresses are allowed";
    if (!form.branch) return "Please select a branch";
    return "";
  };

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
        email: studentEmail,
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

  //   RENDER
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

  //   ALREADY REGISTERED
  if (alreadyRegistered && registeredData) {
    return (
      <div className="max-w-3xl mx-auto mt-20 bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b bg-green-50">
          <h2 className="text-xl font-semibold text-green-700">
            You are already registered for this exam
          </h2>
          <p className="text-sm text-green-600 mt-1">
            Registration details are shown below
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Student Name" value={registeredData.Student?.std_name} />
          <Info
            label="Exam"
            value={registeredData.ScholarshipExam?.exam_title}
          />
          <Info label="Branch" value={registeredData.branch} />
          <Info label="Mobile" value={registeredData.mobile} />
          <Info label="Email" value={registeredData.email} />
          <Info label="DOB" value={registeredData.date_of_birth} />
          <Info
            label="Registration Code"
            value={registeredData.registration_code}
            highlight
          />
          <Info
            label="ACE Student"
            value={registeredData.is_ace_std ? "Yes" : "No"}
          />
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex flex-wrap gap-5 md:gap-0 justify-between items-center">
          <p className="text-sm text-gray-600">
            Redirecting to <b>My Exams</b> in{" "}
            <span className="text-cyan-700 font-semibold">{countdown}s</span>
          </p>

          <button
            onClick={() => router.push("/user-portal/protected/my-exams")}
            className="px-4 py-2 cursor-pointer bg-cyan-700 text-white rounded-md hover:bg-cyan-800"
          >
            Go Now
          </button>
        </div>
      </div>
    );
  }

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
            className="input bg-gray-100 cursor-not-allowed"
            value={studentEmail}
            disabled
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
