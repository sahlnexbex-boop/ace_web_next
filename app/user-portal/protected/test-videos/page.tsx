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
  V2_API_BASE_URL,
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

interface HlsPlayerProps {
  src: string;
  title: string;
  onLoadComplete: () => void;
  className?: string;
}

function HlsPlayer({ src, title, onLoadComplete, className }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;
    let hls: any = null;

    const initHls = () => {
      const Hls = (window as any).Hls;

      if (Hls) {
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
            onLoadComplete();
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Native support (Safari)
          video.src = src;
          video.addEventListener("loadedmetadata", () => {
            video.play().catch(() => {});
            onLoadComplete();
          });
        }
      } else {
        // Load HLS.js dynamically from jsDelivr CDN
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        script.onload = () => {
          const LoadedHls = (window as any).Hls;
          if (LoadedHls && LoadedHls.isSupported()) {
            hls = new LoadedHls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(LoadedHls.Events.MANIFEST_PARSED, () => {
              video.play().catch(() => {});
              onLoadComplete();
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            video.addEventListener("loadedmetadata", () => {
              video.play().catch(() => {});
              onLoadComplete();
            });
          }
        };
        document.body.appendChild(script);
      }
    };

    initHls();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, onLoadComplete]);

  return (
    <video
      ref={videoRef}
      className={className}
      controls
      autoPlay
      playsInline
      controlsList="nodownload"
      disablePictureInPicture
      style={{ width: "100%", height: "100%", backgroundColor: "black" }}
    />
  );
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
  const [hlsUrl, setHlsUrl] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setHlsUrl(null);
      setFetchError(null);
      return;
    }

    setLoading(true);
    setFetchError(null);

    // If we have a numeric vimeo ID, fetch its HLS stream link dynamically
    if (videoId) {
      const fetchHls = async () => {
        try {
          const response = await fetch(`${V2_API_BASE_URL}/app/get_vimeo_hls/${videoId}/`, {
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to load HLS stream: HTTP ${response.status}`);
          }

          const data = await response.json();
          if (data.hls) {
            setHlsUrl(data.hls);
          } else {
            throw new Error("HLS link not returned by API");
          }
        } catch (err: any) {
          console.error("Error fetching HLS url:", err);
          setFetchError(err?.message || "HLS streaming is not supported for this video");
          setLoading(false);
        }
      };

      fetchHls();
    } else {
      // Fallback: If no videoId is provided, we try to use the raw videoUrl directly (if available)
      if (videoUrl) {
        setHlsUrl(videoUrl);
      } else {
        setFetchError("No video source link available");
        setLoading(false);
      }
    }
  }, [isOpen, videoId, videoUrl]);

  // Security: Clean and block injected elements from downloader extensions
  useEffect(() => {
    if (!isOpen || !modalContainerRef.current) return;

    const modalElement = modalContainerRef.current;

    // 1. Mutation Observer: detects and deletes any nodes injected inside the modal wrapper
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Allow our close button, spinner, and video container
            const isAllowed =
              node.tagName === "BUTTON" ||
              node.classList.contains("animate-spin") ||
              node.querySelector(".animate-spin") ||
              node.tagName === "VIDEO" ||
              node.getAttribute("data-react-modal") === "true";

            if (!isAllowed) {
              console.log("[Security] Blocked extension injection:", node);
              node.remove();
            }
          }
        });
      });
    });

    observer.observe(modalElement, {
      childList: true,
      subtree: true,
    });

    // 2. Periodic Scanner: Scan body/page for any absolute-positioned download options injected outside the modal
    const scanInterval = setInterval(() => {
      const extensionSelectors = [
        '[class*="vimeo-downloader"]',
        '[class*="download-btn"]',
        '[class*="downloader-panel"]',
        '[class*="vimeo-download"]',
        '[id*="vimeo-downloader"]',
        '[id*="vimeo-download"]',
        '.vimeo-downloader',
        '.vimeo-downloader-options',
        'div[style*="z-index"][style*="position: absolute"]',
        'div[style*="position:absolute"][style*="z-index"]'
      ];

      extensionSelectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            if (
              el instanceof HTMLElement &&
              !el.classList.contains("bg-black/70") && // Keep backdrop
              !modalElement.contains(el) && // Keep modal contents
              !el.classList.contains("aspect-video")
            ) {
              console.log("[Security] Removed background extension element:", el);
              el.remove();
            }
          });
        } catch (e) {
          // ignore selector errors
        }
      });
    }, 500);

    return () => {
      observer.disconnect();
      clearInterval(scanInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalContainerRef}
        data-react-modal="true"
        className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-[110] p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition-all hover:scale-105 cursor-pointer"
          aria-label="Close video"
        >
          <X size={20} />
        </button>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-[105]">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          </div>
        )}

        {fetchError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white px-4 text-center">
            <p className="text-sm font-semibold text-rose-500 mb-2">Video Playback Error</p>
            <p className="text-xs text-gray-400 max-w-md">{fetchError}</p>
          </div>
        ) : hlsUrl ? (
          <HlsPlayer
            src={hlsUrl}
            title={title}
            className={`w-full h-full transition-opacity duration-500 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            onLoadComplete={() => setLoading(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">
            Preparing video stream...
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
