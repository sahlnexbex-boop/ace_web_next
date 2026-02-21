"use client";

import React, { useEffect, useState } from "react";
import { AlarmClock, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { getScholarshipExams } from "@/lib/api/scholarshipExam";
import { verifyStudentToken } from "@/lib/api/studentAuth";
import { useToast } from "@/contexts/ToastContext";
import { getTutions } from "@/lib/api/tution";
import { getDynamicEvents } from "@/lib/api/dynamicEvents";

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

interface TutionItem {
  tution_id: number;
  tution_title: string;
  tution_description: string;
  tution_image: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

interface DynamicEvent {
  dynmc_event_id: number;
  dynmc_event_title: string;
  dynmc_event_description: string;
  dynmc_event_location: string;
  dynmc_event_date_time: string;
  dynmc_event_image: string;
  dynmc_event_form_available: number;
}

type CombinedItem =
  | { kind: "exam"; exam: ScholarshipExam }
  | { kind: "tution"; tution: TutionItem }
  | { kind: "event"; event: DynamicEvent };

export default function ScholarshipExamPage() {
  const [exams, setExams] = useState<ScholarshipExam[]>([]);
  const [tutions, setTutions] = useState<TutionItem[]>([]);
  const [events, setEvents] = useState<DynamicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // which exam is currently being verified
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  //   FETCH EXAMS & TUTIONS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, tutionRes, eventRes] = await Promise.all([
          getScholarshipExams(1, 10, "", 1),
          getTutions(1, 6, "", 1),
          getDynamicEvents(1, 6, "", 1),
        ]);
        setExams(examRes?.data || []);
        setTutions(tutionRes?.data || []);
        setEvents(eventRes?.data || []);
      } catch (e) {
        console.error("Failed to fetch exams / tutions / events", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const combinedItems: CombinedItem[] = [
    ...exams.map((e) => ({ kind: "exam", exam: e } as CombinedItem)),
    ...tutions.map((t) => ({ kind: "tution", tution: t } as CombinedItem)),
    ...events.map((e) => ({ kind: "event", event: e } as CombinedItem)),
  ];

  if (loading) {
    return (
      <section className="w-full bg-[#F3FBFF] md:py-14 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-10 text-center text-gray-500">
            Loading scholarship exams, tutions and events...
          </div>
        </div>
      </section>
    );
  }

  if (combinedItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#F3FBFF] md:py-14 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* CASE 1: SINGLE ITEM */}
        {combinedItems.length === 1 && (
          combinedItems[0].kind === "exam" ? (
            <SingleExamHero
              exam={combinedItems[0].exam}
              onRegister={handleRegister}
              verifyingId={verifyingId}
              server_url={server_url}
            />
          ) : combinedItems[0].kind === "tution" ? (
            <SingleTutionHero
              tution={combinedItems[0].tution}
              router={router}
              server_url={server_url}
            />
          ) : (
            <SingleEventHero
              event={combinedItems[0].event}
              router={router}
              server_url={server_url}
            />
          )
        )}

        {/* CASE 2: TWO ITEMS */}
        {combinedItems.length === 2 && (
          <div className="grid md:grid-cols-2 gap-6">
            {combinedItems.map((item, idx) => (
              <CombinedCard
                key={
                  item.kind === "exam"
                    ? `exam-${item.exam.exam_id}`
                    : item.kind === "tution"
                      ? `tution-${item.tution.tution_id}`
                      : `event-${item.event.dynmc_event_id}`
                }
                item={item}
                variant="two"
                verifyingId={verifyingId}
                server_url={server_url}
                onRegister={handleRegister}
                router={router}
              />
            ))}
          </div>
        )}

        {/* CASE 3+: GRID */}
        {combinedItems.length >= 3 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {combinedItems.map((item) => (
              <CombinedCard
                key={
                  item.kind === "exam"
                    ? `exam-${item.exam.exam_id}`
                    : item.kind === "tution"
                      ? `tution-${item.tution.tution_id}`
                      : `event-${item.event.dynmc_event_id}`
                }
                item={item}
                variant="grid"
                verifyingId={verifyingId}
                server_url={server_url}
                onRegister={handleRegister}
                router={router}
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
            ${verifyingId === exam.exam_id
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

/* ================= SINGLE TUTION HERO ================= */
function SingleTutionHero({
  tution,
  router,
  server_url,
}: {
  tution: TutionItem;
  router: ReturnType<typeof useRouter>;
  server_url: string | undefined;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-3 md:gap-8 items-center">
      <div className="md:col-span-2 space-y-4 p-6 md:p-8">
        <h3 className="text-xl md:text-3xl font-bold text-cyan-900">
          {tution.tution_title}
        </h3>

        <p className="text-gray-600 md:text-lg text-sm md:mb-10">
          {tution.tution_description}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {tution.start_date && (
            <div className="flex items-center gap-1">
              <Calendar size={18} className="text-cyan-700" />
              <span>
                {new Date(tution.start_date).toLocaleDateString("en-IN")}
                {tution.end_date && " - "}
                {tution.end_date &&
                  new Date(tution.end_date).toLocaleDateString("en-IN")}
              </span>
            </div>
          )}
          {tution.start_time && (
            <div className="flex items-center gap-1">
              <AlarmClock size={18} className="text-cyan-700" />
              <span>
                {tution.start_time}
                {tution.end_time && " - "}
                {tution.end_time}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() =>
            router.push(
              `/tuition?tution_id=${tution.tution_id}`
            )
          }
          className="mt-4 inline-flex items-center bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer"
        >
          Register Now
        </button>
      </div>

      <div className="flex justify-center md:justify-end h-full">
        <img
          src={server_url + tution.tution_image}
          alt={tution.tution_title}
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
              text-white md:px-5 px-3 md:py-1.5 py-1 rounded-lg font-medium cursor-pointer
              ${verifyingId === exam.exam_id
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

/* ================= COMBINED CARD ================= */
function CombinedCard({
  item,
  variant,
  verifyingId,
  server_url,
  onRegister,
  router,
}: {
  item: CombinedItem;
  variant: "two" | "grid";
  verifyingId: number | null;
  server_url: string | undefined;
  onRegister: (exam: ScholarshipExam) => void;
  router: ReturnType<typeof useRouter>;
}) {
  if (item.kind === "exam") {
    return (
      <ExamCard
        exam={item.exam}
        onRegister={onRegister}
        verifyingId={verifyingId}
        server_url={server_url}
        variant={variant}
      />
    );
  }

  if (item.kind === "event") {
    const event = item.event;
    const imageHeight = variant === "two" ? "md:h-80 h-52" : "md:h-56 h-52";

    return (
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
        <img
          src={server_url + event.dynmc_event_image}
          alt={event.dynmc_event_title}
          className={`w-full ${imageHeight} object-cover`}
        />

        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-semibold text-lg mb-2 text-cyan-900 line-clamp-1">
            {event.dynmc_event_title}
          </h4>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.dynmc_event_description}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <div className="text-xs text-gray-700 space-y-1 mb-4">
              {event.dynmc_event_date_time && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {new Date(event.dynmc_event_date_time).toLocaleDateString("en-IN")}
                  </span>
                </div>
              )}
              {event.dynmc_event_location && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{event.dynmc_event_location}</span>
                </div>
              )}
            </div>

            {event.dynmc_event_form_available === 1 && (
              <button
                onClick={() =>
                  router.push(`/public/event-reg/${event.dynmc_event_id}`)
                }
                className="inline-flex items-center bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] text-white md:px-5 px-3 md:py-1.5 py-1 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 cursor-pointer"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === "tution") {
    const tution = item.tution;
    const imageHeight = variant === "two" ? "md:h-80 h-52" : "md:h-56 h-52";

    return (
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
        <img
          src={server_url + tution.tution_image}
          alt={tution.tution_title}
          className={`w-full ${imageHeight} object-cover`}
        />

        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-semibold text-lg mb-2 text-cyan-900">
            {tution.tution_title}
          </h4>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {tution.tution_description}
          </p>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-700 space-y-1 mb-4">
              {tution.start_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {new Date(tution.start_date).toLocaleDateString("en-IN")}
                    {tution.end_date && " - "}
                    {tution.end_date &&
                      new Date(tution.end_date).toLocaleDateString("en-IN")}
                  </span>
                </div>
              )}
              {tution.start_time && (
                <div className="flex items-center gap-1">
                  <AlarmClock size={14} />
                  <span>
                    {tution.start_time}
                    {tution.end_time && " - "}
                    {tution.end_time}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() =>
                router.push(
                  `/tuition?tution_id=${tution.tution_id}`
                )
              }
              className="inline-flex items-center bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] text-white md:px-5 px-3 md:py-1.5 py-1 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 cursor-pointer"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ================= SINGLE EVENT HERO ================= */
function SingleEventHero({
  event,
  router,
  server_url,
}: {
  event: DynamicEvent;
  router: ReturnType<typeof useRouter>;
  server_url: string | undefined;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-3 md:gap-8 items-center">
      <div className="md:col-span-2 space-y-4 p-6 md:p-8">
        <h3 className="text-xl md:text-3xl font-bold text-cyan-900">
          {event.dynmc_event_title}
        </h3>

        <p className="text-gray-600 md:text-lg text-sm md:mb-10 line-clamp-3">
          {event.dynmc_event_description}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {event.dynmc_event_date_time && (
            <div className="flex items-center gap-1">
              <Calendar size={18} className="text-cyan-700" />
              <span>
                {new Date(event.dynmc_event_date_time).toLocaleDateString("en-IN")}
              </span>
            </div>
          )}
          {event.dynmc_event_location && (
            <div className="flex items-center gap-1">
              <MapPin size={18} className="text-cyan-700" />
              <span>{event.dynmc_event_location}</span>
            </div>
          )}
        </div>

        {event.dynmc_event_form_available === 1 && (
          <button
            onClick={() =>
              router.push(`/public/event-reg/${event.dynmc_event_id}`)
            }
            className="mt-4 inline-flex items-center bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer"
          >
            Register Now
          </button>
        )}
      </div>

      <div className="flex justify-center md:justify-end h-full">
        <img
          src={server_url + event.dynmc_event_image}
          alt={event.dynmc_event_title}
          className="w-full h-full max-w-sm object-cover"
        />
      </div>
    </div>
  );
}
