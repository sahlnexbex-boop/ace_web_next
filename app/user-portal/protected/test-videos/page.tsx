"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  PlayCircle,
  FileText,
  Clock,
  Award,
  Eye,
  ThumbsUp,
  Loader2,
  X,
  CheckCircle2,
  Circle,
  Download,
} from "lucide-react";
import {
  getDaywiseScheduleCourse,
  TestVideoItem,
} from "@/lib/api/testVideo";

/* ================= CONSTANTS ================= */
// Hard-coded course/module pair per the spec.
//   GET https://v2api.aceonline.app/app/daywise-schedule-course/331/1984/
const COURSE_ID = 331;
const MODULE_ID = 1984;

/* ================= HELPERS ================= */

/**
 * Vimeo's CDN thumbnails look like:
 *   https://i.vimeocdn.com/video/1439220116-edbf6...-d_100x75
 * The video id is the leading digits before the first "-".
 */
const extractVimeoIdFromThumbnail = (thumb?: string): string | null => {
  if (!thumb) return null;
  try {
    const url = new URL(thumb);
    const match = url.pathname.match(/\/video\/(\d+)/);
    return match?.[1] || null;
  } catch {
    return null;
    /* swallow — a non-URL thumbnail is harmless */
  }
};

/**
 * Vimeo player quality labels are 240p / 360p / 540p / 720p / 1080p.
 * We pick the highest one that's actually present in the response.
 */
const PREFERRED_QUALITIES = ["1080", "720", "540", "360", "240"] as const;

const pickBestVideoUrl = (links: Record<string, string>): string | null => {
  if (!links || typeof links !== "object") return null;
  for (const q of PREFERRED_QUALITIES) {
    if (links[q]) return links[q];
  }
  const first = Object.values(links)[0];
  return first || null;
};

/* ================= VIDEO MODAL ================= */

interface ShadowIframeProps {
  src: string;
  title: string;
  onLoadComplete: () => void;
  className?: string;
}

function ShadowIframe({ src, title, onLoadComplete, className }: ShadowIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Attach shadow root safely if it doesn't already exist
    let shadow = containerRef.current.shadowRoot;
    if (!shadow) {
      shadow = containerRef.current.attachShadow({ mode: "open" });
    } else {
      shadow.innerHTML = ""; // Clear previous shadow tree contents
    }

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allowfullscreen", "true");

    iframe.onload = () => {
      onLoadComplete();
    };

    shadow.appendChild(iframe);
  }, [src, title, onLoadComplete]);

  return <div ref={containerRef} className={className} />;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
  videoUrl: string | null;
  title: string;
}

function VideoModal({
  isOpen,
  onClose,
  videoId,
  videoUrl,
  title,
}: VideoModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) setLoading(true);
  }, [isOpen, videoId, videoUrl]);

  if (!isOpen) return null;

  // Prefer Vimeo's iframe player when we can extract a numeric id.
  // Falls back to the encrypted CDN URL the API returned.
  const playerSrc = videoId
    ? `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
    : videoUrl || "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[110] p-5 bg-black text-white rounded-full transition-all hover:scale-105 cursor-pointer"
          aria-label="Close video"
        >
          <X size={24} />
        </button>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-[105]">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          </div>
        )}

        {playerSrc ? (
          <ShadowIframe
            src={playerSrc}
            title={title}
            className={`w-full h-full transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"
              }`}
            onLoadComplete={() => setLoading(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">
            No video content available
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= EXAM MODAL ================= */

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: {
    name: string;
    instruction: string[];
    count: number;
    duration: number;
    positivemark: number;
    negativemark: number;
    total_score: number;
  } | null;
}

function ExamModal({ isOpen, onClose, exam }: ExamModalProps) {
  if (!isOpen || !exam) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-cyan-700 to-sky-600 text-white p-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{exam.name}</h2>
            <p className="text-sm text-cyan-100 mt-1">Exam Instructions</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
            {exam.instruction.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t">
            <StatChip
              icon={<FileText size={16} />}
              label="Questions"
              value={String(exam.count)}
            />
            <StatChip
              icon={<Clock size={16} />}
              label="Duration (min)"
              value={String(exam.duration)}
            />
            <StatChip
              icon={<Award size={16} />}
              label="Total Marks"
              value={String(exam.total_score)}
            />
            <StatChip
              icon={<CheckCircle2 size={16} />}
              label="+ve Mark"
              value={String(exam.positivemark)}
            />
            <StatChip
              icon={<X size={16} />}
              label="-ve Mark"
              value={String(exam.negativemark)}
            />
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-medium cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-lg px-3 py-2">
      <span className="text-cyan-700">{icon}</span>
      <div>
        <p className="text-[11px] text-gray-500 leading-none">{label}</p>
        <p className="text-sm font-semibold text-cyan-800">{value}</p>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function TestVideosPage() {
  const [items, setItems] = useState<TestVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeItem, setActiveItem] = useState<TestVideoItem | null>(null);
  const [openExam, setOpenExam] = useState<TestVideoItem | null>(null);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDaywiseScheduleCourse(COURSE_ID, MODULE_ID);
        if (cancelled) return;
        setItems(data);
        // pre-seed liked state from server response
        const seeded = new Set<number>();
        data.forEach((it) => {
          if (it.content?.liked) seeded.add(it.id);
        });
        setLikedIds(seeded);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || "Failed to load test videos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalCount = items.length;
  const totalDuration = useMemo(
    () =>
      items.reduce((acc, it) => {
        const d = Number(it.content?.questionpapers?.[0]?.duration || 0);
        return acc + d;
      }, 0),
    [items]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-cyan-800">Test Videos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Watch the lesson video and take the matching exam to mark it
            complete.
          </p>
        </div>
        {!loading && !error && (
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-3 sm:mt-0">
            <span className="flex items-center gap-1">
              <PlayCircle size={14} className="text-cyan-700" />
              {totalCount} videos
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-cyan-700" />
              {totalDuration} min total
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-3" />
          <p>Loading test videos...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <img
            src="/no_data.png"
            alt=""
            className="w-52 opacity-40"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
          <p className="mt-3">No test videos available</p>
        </div>
      )}

      {/* List */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const exam = item.exams ?? item.content?.questionpapers?.[0] ?? null;
            const material = item.content?.material?.[0];
            const vimeoId = extractVimeoIdFromThumbnail(item.thumbnails);
            const videoUrl = pickBestVideoUrl(item.video_links);
            const isLiked = likedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col"
              >
                {/* Thumbnail */}
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setActiveItem(item)}
                >
                  <img
                    src={item.thumbnails}
                    alt={item.topic_name || "Video"}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <PlayCircle
                      size={56}
                      className="text-white drop-shadow-lg"
                    />
                  </div>
                  {item.week != null && (
                    <span className="absolute top-2 left-2 bg-cyan-700 text-white text-[11px] px-2 py-0.5 rounded-full">
                      Week {item.week}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {item.topic_name || "Untitled"}
                  </h3>
                  {item.subject && (
                    <p className="text-xs text-cyan-700 mt-1">{item.subject}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {item.content?.like_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {exam?.duration ?? "-"} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} /> {exam?.count ?? "-"} Q
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setActiveItem(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-700 to-sky-600 text-white text-sm py-2 rounded-lg hover:from-cyan-800 hover:to-sky-700 cursor-pointer"
                    >
                      <PlayCircle size={16} />
                      Watch
                    </button>

                    {exam && (
                      <button
                        onClick={() => setOpenExam(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-cyan-600 text-cyan-700 text-sm py-2 rounded-lg hover:bg-cyan-50 cursor-pointer"
                      >
                        <FileText size={16} />
                        Exam
                      </button>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center gap-1 cursor-pointer ${isLiked
                        ? "text-cyan-700"
                        : "text-gray-500 hover:text-cyan-700"
                        }`}
                    >
                      {isLiked ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Circle size={14} />
                      )}
                      {isLiked ? "Liked" : "Like"}
                    </button>

                    {material?.file && (
                      <a
                        href={material.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-500 hover:text-cyan-700 cursor-pointer"
                      >
                        <Download size={14} />
                        Material
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video modal */}
      <VideoModal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        videoId={activeItem?.vimeoid || extractVimeoIdFromThumbnail(activeItem?.thumbnails)}
        videoUrl={pickBestVideoUrl(activeItem?.video_links ?? {})}
        title={activeItem?.topic_name || "Video player"}
      />

      {/* Exam modal */}
      <ExamModal
        isOpen={!!openExam}
        onClose={() => setOpenExam(null)}
        exam={
          openExam
            ? (openExam.exams ??
              openExam.content?.questionpapers?.[0] ??
              null)
            : null
        }
      />
    </div>
  );
}
