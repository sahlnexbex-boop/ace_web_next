"use client";

import { useEffect, useState } from "react";
import {
  getExamRegistrations,
  getHallTicketByRegistrationId,
} from "@/lib/api/examRegistration";
import { Download } from "lucide-react";

/* ================= TYPES ================= */
interface ExamRegistration {
  reg_id: number;
  registration_code: string;
  status: number;
  created_at: string;
  ScholarshipExam?: {
    exam_title: string;
  };
  name: string;
}

/* ================= HELPERS ================= */
const makeSafeFileName = (value: string = "") =>
  value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");

export default function MyExams() {
  const [data, setData] = useState<ExamRegistration[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  /* ================= FETCH ================= */
  const fetchMyExams = async (pageNo: number) => {
    try {
      setLoading(true);

      const stdId = Number(localStorage.getItem("std_id"));
      if (!stdId) return;

      const res = await getExamRegistrations(pageNo, limit, "", 1, stdId);

      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 1);
    } catch (err) {
      console.error("Failed to fetch exams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyExams(page);
  }, [page]);

  /* ================= DOWNLOAD ================= */
  const downloadHallTicket = async (
    regId: number,
    studentName: string,
    examName: string
  ) => {
    try {
      const response = await getHallTicketByRegistrationId(regId);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const safeStudent = makeSafeFileName(studentName);
      const safeExam = makeSafeFileName(examName);

      const fileName = `${safeStudent}_${safeExam}_Hall_Ticket.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Hall ticket download failed", err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6 text-cyan-800">
        My Exams
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Loading exams...</p>
      )}

      {!loading && data.length === 0 && (
        <p className="text-center text-gray-500">No exams found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => {
          const examName =
            item.ScholarshipExam?.exam_title || "Exam";
          const studentName =
            item.name || "Student";

          return (
            <div
              key={item.reg_id}
              className="bg-white rounded-xl shadow-md border p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {examName}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Reg No:{" "}
                  <span className="font-medium text-gray-700">
                    {item.registration_code}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Registered on:{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                    item.status === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status === 1 ? "Approved" : "Pending"}
                </span>
              </div>

              {/* ACTION */}
              {item.status === 1 && (
                <button
                  onClick={() =>
                    downloadHallTicket(
                      item.reg_id,
                      studentName,
                      examName
                    )
                  }
                  className="mt-5 flex items-center justify-center gap-2 w-full cursor-pointer bg-gradient-to-r from-cyan-700 to-sky-600 text-white py-2 rounded-lg transition-all hover:from-cyan-800 hover:to-sky-700"
                >
                  <Download size={18} />
                  <span>Download Hall Ticket</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
