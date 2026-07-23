// Static, public endpoint served by the v2 backend (v2api.aceonline.app).
// No auth token is attached because the resource is hard-coded to a single
// course/module pair in the spec.

const V2_API_BASE_URL =
  process.env.NEXT_PUBLIC_V2_API_BASE_URL || "https://v2api.aceonline.app";

export interface TestVideoMaterial {
  id: number;
  name: string;
  file: string;
  code: string;
  icon: string | null;
}

export interface TestVideoQuestionPaper {
  id: number;
  name: string;
  instruction: string[];
  positivemark: number;
  negativemark: number;
  duration: number;
  count: number;
  total_score: number;
}

export interface TestVideoContent {
  id: number;
  material: TestVideoMaterial[];
  questionpapers: TestVideoQuestionPaper[];
  liked?: boolean;
  like_count?: number;
  created_at?: string;
}

export interface TestVideoItem {
  id: number;
  content: TestVideoContent;
  exams?: TestVideoQuestionPaper;
  thumbnails: string;
  video_links: Record<string, string>;
  subject?: string;
  week?: number;
  purchased?: boolean;
  topic_name?: string;
  course?: { id: number; name: string };
}

interface DaywiseScheduleResponse {
  data: TestVideoItem[];
}

/**
 * Fetch the static daywise schedule for a course/module pair.
 *
 * Endpoint: GET {V2_API_BASE_URL}/app/daywise-schedule-course/{course}/{module}/
 */
export const getDaywiseScheduleCourse = async (
  course: number | string,
  module: number | string
): Promise<TestVideoItem[]> => {
  const url = `${V2_API_BASE_URL}/app/daywise-schedule-course/${course}/${module}/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    // No Authorization header — the endpoint is a public, hard-coded static URL.
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load test videos (HTTP ${response.status} ${response.statusText})`
    );
  }

  const text = await response.text();
  let parsed: DaywiseScheduleResponse | TestVideoItem[];

  try {
    parsed = text ? JSON.parse(text) : { data: [] };
  } catch {
    throw new Error("Invalid JSON returned from daywise-schedule-course");
  }

  if (Array.isArray(parsed)) {
    return parsed as TestVideoItem[];
  }

  return (parsed as DaywiseScheduleResponse).data || [];
};
