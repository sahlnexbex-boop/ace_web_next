"use client";

import React, { useEffect, useState } from "react";
import { AlarmClock, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { getScholarshipExams } from "@/lib/api/scholarshipExam";
import { verifyStudentToken } from "@/lib/api/studentAuth";
import { useToast } from "@/contexts/ToastContext";

interface ScholarshipExam {
  exam_id: number;
  exam_title: string;
  exam_description: string;
  exam_date: string;
  exam_time: string;
  exam_location: string;
  last_apply_date: string;
  exam_image: string;
}

export default function ScholarshipExamPage() {
  const [exams, setExams] = useState<ScholarshipExam[]>([]);
  const [loading, setLoading] = useState(true);

  // which exam is currently being verified
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  //   FETCH EXAMS
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await getScholarshipExams(1, 10, "", 1);
        setExams(res?.data || []);
      } catch (e) {
        console.error("Failed to fetch exams", e);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  //   HANDLE REGISTER
  const handleRegister = async (exam: ScholarshipExam) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      showError("Please login or signup first", "error");
      router.push("/user-portal/login");
      return;
    }

    try {
      setVerifyingId(exam.exam_id);
      await verifyStudentToken(token);

      //  token valid
      router.push(`/user-portal/protected/reg-exam/${exam.exam_id}`);
    } catch (err) {
      console.error(err);
      showError("Please login or signup first", "error");
      router.push("/user-portal/login");
    } finally {
      setVerifyingId(null);
    }
  };

  //   LOADING
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading scholarship exams...
      </div>
    );
  }

  //  EMPTY
  if (!exams.length) {
    return null;
  }

  return (
    <section className="w-full bg-[#F3FBFF] md:py-14 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="md:text-3xl text-2xl font-semibold text-center text-cyan-900 mb-10">
          Scholarship Exams
        </h2>

        {/* CASE 1: SINGLE */}
        {exams.length === 1 && (
          <SingleExamHero
            exam={exams[0]}
            onRegister={handleRegister}
            verifyingId={verifyingId}
            server_url={server_url}
          />
        )}

        {/* CASE 2: TWO */}
        {exams.length === 2 && (
          <div className="grid md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <ExamCard
                key={exam.exam_id}
                exam={exam}
                onRegister={handleRegister}
                verifyingId={verifyingId}
                server_url={server_url}
                variant="two"
              />
            ))}
          </div>
        )}

        {/* CASE 3: THREE OR MORE */}
        {exams.length >= 3 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <ExamCard
                key={exam.exam_id}
                exam={exam}
                onRegister={handleRegister}
                verifyingId={verifyingId}
                server_url={server_url}
                variant="grid"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= SINGLE HERO ================= */
function SingleExamHero({
  exam,
  onRegister,
  verifyingId,
  server_url,
}: {
  exam: ScholarshipExam;
  onRegister: (e: ScholarshipExam) => void;
  verifyingId: number | null;
  server_url: string | undefined;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-3 md:gap-8 items-center">
      <div className="md:col-span-2 space-y-4 p-6 md:p-8">
        <h3 className="text-xl md:text-3xl font-bold text-cyan-900">
          {exam.exam_title}
        </h3>

        <p className="text-gray-600 md:text-lg text-sm md:mb-10">
          {exam.exam_description}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Calendar size={18} className="text-cyan-700" />
            {new Date(exam.exam_date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={18} className="text-cyan-700" />
            {exam.exam_location}
          </div>
          <div className="flex items-center gap-1">
            <AlarmClock size={18} className="text-cyan-700" />
            {exam.exam_time}
          </div>
        </div>

        <button
          onClick={() => onRegister(exam)}
          disabled={verifyingId === exam.exam_id}
          className={`mt-4 inline-flex items-center
            bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-blue-600 hover:to-cyan-600
            text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer
            ${
              verifyingId === exam.exam_id
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
        >
          {verifyingId === exam.exam_id ? "Checking..." : "Register Now"}
        </button>
      </div>

      <div className="flex justify-center md:justify-end h-full">
        <img
          src={server_url + exam.exam_image}
          alt={exam.exam_title}
          className="w-full h-full max-w-sm object-cover"
        />
      </div>
    </div>
  );
}

/* ================= CARD ================= */
function ExamCard({
  exam,
  onRegister,
  verifyingId,
  server_url,
  variant = "grid",
}: {
  exam: ScholarshipExam;
  onRegister: (e: ScholarshipExam) => void;
  verifyingId: number | null;
  server_url: string | undefined;
  variant?: "two" | "grid";
}) {
  const imageHeight = variant === "two" ? "md:h-80 h-52" : "md:h-56 h-52";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <img
        src={server_url + exam.exam_image}
        alt={exam.exam_title}
        className={`w-full ${imageHeight} object-cover`}
      />

      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-semibold text-lg mb-2 text-cyan-900">
          {exam.exam_title}
        </h4>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {exam.exam_description}
        </p>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-700 space-y-1 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(exam.exam_date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              {exam.exam_location}
            </div>
            <div className="flex items-center gap-1">
              <AlarmClock size={14} />
              {exam.exam_time}
            </div>
          </div>

          <button
            onClick={() => onRegister(exam)}
            disabled={verifyingId === exam.exam_id}
            className={`inline-flex items-center
              bg-gradient-to-r from-[#1F67A5] to-[#00A0E3]
              text-white md:px-5 px-3 md:py-1.5 py-1 rounded-lg font-medium
              ${
                verifyingId === exam.exam_id
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
          >
            {verifyingId === exam.exam_id ? "Checking..." : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
