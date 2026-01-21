"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTutions } from "@/lib/api/tution";
import { createTutionRegistration } from "@/lib/api/tutionRegistration";
import { useToast } from "@/contexts/ToastContext";

interface TutionItem {
  tution_id: number;
  tution_title: string;
}

export default function PublicTutionRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();

  const [tutions, setTutions] = useState<TutionItem[]>([]);
  const [form, setForm] = useState({
    tution_id: "",
    std_name: "",
    guardian_name: "",
    guardian_contact: "",
    school: "",
    standard: "",
    medium: "english",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingTutions, setLoadingTutions] = useState(true);

  const initialTutionId = searchParams.get("tution_id") || "";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTutions(1, 100, "", 1);
        const list: TutionItem[] = res?.data || [];
        setTutions(list);

        if (initialTutionId && list.length) {
          const exists = list.some(
            (t) => String(t.tution_id) === String(initialTutionId)
          );
          setForm((prev) => ({
            ...prev,
            tution_id: exists ? String(initialTutionId) : "",
          }));
        }
      } catch (err) {
        console.error("Failed to load tutions", err);
        showError("Failed to load tutions. Please try again.");
      } finally {
        setLoadingTutions(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTutionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tution_id) {
      showError("Please select a tution");
      return;
    }
    if (!form.std_name || !form.guardian_name || !form.guardian_contact) {
      showError("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        tution_id: Number(form.tution_id),
      };
      await createTutionRegistration(payload);
      showSuccess("Tution registration submitted successfully");
      router.push("/public/home");
    } catch (err) {
      console.error("Tution registration failed", err);
      showError("Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen tution-registration-page bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-10">
      {/* CSS Hack to force Autocomplete/Autofill to match the dark theme */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active,
        select:-webkit-autofill,
        select:-webkit-autofill:hover, 
        select:-webkit-autofill:focus, 
        select:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #0f172a inset !important; /* Matches slate-900 */
            -webkit-text-fill-color: #f1f5f9 !important; /* Matches slate-100 */
            transition: background-color 5000s ease-in-out 0s;
            caret-color: white;
        }
      `}</style>

      <div className="relative w-full max-w-3xl">
        {/* Glow behind card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40 blur-3xl opacity-60 pointer-events-none" />

        {/* Glassmorphism Card */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/15 md:rounded-3xl rounded-lg shadow-2xl px-4 py-5 md:px-10 md:py-10 text-white">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
              Tution Registration
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-200/80">
              Fill in your details to register for the selected tution program.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tution */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs md:text-sm text-slate-100/90">
                  Tution<span className="text-red-400">*</span>
                </label>
                <select
                  name="tution_id"
                  value={form.tution_id}
                  onChange={handleChange}
                  disabled={loadingTutions}
                  className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900">Select Tution</option>
                  {tutions.map((t) => (
                    <option key={t.tution_id} value={t.tution_id} className="bg-slate-900">
                      {t.tution_title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs md:text-sm text-slate-100/90">
                  Medium<span className="text-red-400">*</span>
                </label>
                <select
                  name="medium"
                  value={form.medium}
                  onChange={handleChange}
                  className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                >
                  <option value="english" className="bg-slate-900">English</option>
                  <option value="malayalam" className="bg-slate-900">Malayalam</option>
                </select>
              </div>
            </div>

            {/* Names */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs md:text-sm text-slate-100/90">
                  Student Name<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="std_name"
                  value={form.std_name}
                  onChange={handleChange}
                  className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                  placeholder="Enter student name"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs md:text-sm text-slate-100/90">
                  Guardian Name<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="guardian_name"
                  value={form.guardian_name}
                  onChange={handleChange}
                  className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                  placeholder="Enter guardian name"
                />
              </div>
            </div>

            {/* Contact & Standard */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs md:text-sm text-slate-100/90">
                  Guardian Contact<span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="guardian_contact"
                  value={form.guardian_contact}
                  onChange={handleChange}
                  className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                  placeholder="Enter contact number"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs md:text-sm text-slate-100/90">
                  Standard<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="standard"
                  value={form.standard}
                  onChange={handleChange}
                  className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                  placeholder="e.g. 8, 9, 10"
                />
              </div>
            </div>

            {/* School */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs md:text-sm text-slate-100/90">
                School<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="school"
                value={form.school}
                onChange={handleChange}
                className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                placeholder="Enter school name"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => router.push("/public/home")}
                className="text-slate-200/80 text-sm hidden md:block hover:text-white transition-colors cursor-pointer"
              >
                ← Back to Home
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full justify-center md:w-auto items-center px-6 py-2.5 md:rounded-xl rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-sm md:text-base font-semibold shadow-lg shadow-cyan-500/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}