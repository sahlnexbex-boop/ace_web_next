"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createExamRegistration } from "@/lib/api/examRegistration";
import { useToast } from "@/contexts/ToastContext";

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

interface Props {
  open: boolean;
  onClose: () => void;
  exam: any;
}

export default function ExamRegistrationModal({ open, onClose, exam }: Props) {
  const initialFormState = {
    name: "",
    mobile: "",
    email: "",
    date_of_birth: "",
    branch: "",
    address: "",
    is_ace_std: 0,
  };
  const [form, setForm] = useState<any>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (!open) setError("");
  }, [open]);

  if (!open) return null;

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!/^\d{10}$/.test(form.mobile)) return "Mobile number must be 10 digits";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email))
      return "Only Gmail addresses are allowed";
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
      });
      showSuccess("Registration successful");
      setForm(initialFormState);
      onClose();
    } catch (e: any) {
      showError(e?.message || "Registration failed");
      setError(e?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-[0.5px] flex items-center justify-center px-4">
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-xl
                   animate-[fadeIn_0.25s_ease-in-out]"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-cyan-800">
            Exam Registration
          </h3>
          <button className="cursor-pointer" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <p className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm">
              {error}
            </p>
          )}

          <input
            placeholder="Full Name"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Mobile Number"
            className="input"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />

          <input
            placeholder="Email (Gmail only)"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="date"
            className="input"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
          />

          {/* Branch */}
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

          {/* Exam (disabled) */}
          <input
            className="input bg-gray-100"
            value={exam.exam_title}
            disabled
          />

          <textarea
            placeholder="Address"
            className="input h-20"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          {/* ACE Student */}
          <label className="flex items-center gap-2 text-sm ms-2">
            <input
              type="checkbox"
              checked={form.is_ace_std === 1}
              onChange={(e) =>
                setForm({ ...form, is_ace_std: e.target.checked ? 1 : 0 })
              }
              className="cursor-pointer scale-150"
            />
            I am an ACE student
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex justify-end gap-3">
          <button
            onClick={() => {
              setForm(initialFormState);
              setError("");
              onClose();
            }}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
