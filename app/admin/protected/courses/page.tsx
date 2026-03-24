"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getCourses,
  getCourseById,
  deleteCourse,
  createFullCourse,
  updateFullCourse,
} from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function CoursesPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string; category_id?: string }>({});
  const debouncedSearch = useDebounce(search, 500);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(1, 100);
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await getCourses(page, 10, debouncedSearch, filters);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [page, debouncedSearch, filters]);

  const categoryOptions = Array.isArray(categories)
    ? categories.map((c) => ({
        label: c.category_name,
        value: String(c.category_id),
      }))
    : [];

  const handleView = async (row: any) => {
    try {
      // Fetch full details including modules and chapters for viewing
      const res = await getCourseById(row.course_id, true, true);
      if (res?.data) {
        const c = res.data;

        const formatted = {
          "Course Name": c.course_name || "—",
          Description: (
            <p className="text-gray-700 whitespace-pre-line">
              {c.course_description || "—"}
            </p>
          ),
          Category: c.category?.category_name || "—",
          Rating: c.course_rating || "—",
          Duration: c.course_duration || "—",
          Fee: c.course_fee || "—",
          Overview: c.course_overview || "—",
          Syllabus: c.course_syllabus || "—",
          "Study Material": c.course_study_material || "—",
          "Syllabus File": c.course_syllabus_file ? (
            <a
              href={server_url + c.course_syllabus_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline"
            >
             View Syllabus
            </a>
          ) : (
            "—"
          ),
          "Questions File": c.course_questions_file ? (
            <a
              href={server_url + c.course_questions_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline"
            >
              View Questions
            </a>
          ) : (
            "—"
          ),
          "Course Image": c.course_image ? (
            <div className="flex justify-start">
              <img
                src={server_url + c.course_image}
                alt="Course"
                className="w-24 h-16 object-cover rounded shadow-sm"
              />
            </div>
          ) : (
            "—"
          ),
          Status:
            c.status == 1 || c.status == "1" ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
            ),
          "Created At": c.created_at
            ? new Date(c.created_at).toLocaleString("en-IN")
            : "—",
          "Updated At": c.updated_at
            ? new Date(c.updated_at).toLocaleString("en-IN")
            : "—",
          "Course Content": (c.modules && c.modules.length > 0) ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mt-2 border-t pt-4">
               {c.modules.map((m: any, mIdx: number) => (
                 <div key={mIdx} className="border border-cyan-100 rounded-lg bg-cyan-50/20 p-3 shadow-sm">
                    <h5 className="font-bold text-cyan-800 flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-700 text-white flex items-center justify-center text-[10px] shadow-sm">{mIdx + 1}</span>
                      {m.module_name}
                    </h5>
                    <div className="space-y-1 ml-8">
                       {m.chapters?.map((ch: any, cIdx: number) => (
                         <div key={cIdx} className="flex items-center justify-between text-sm py-1.5 border-b border-white/50 hover:bg-white/80 px-2 rounded transition bg-white/40">
                            <span className="text-gray-700">{ch.chapter_name}</span>
                            {ch.is_preview === 1 ? (
                              <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">Preview</span>
                            ) : (
                               <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">Locked</span>
                            )}
                         </div>
                       ))}
                       {(!m.chapters || m.chapters.length === 0) && (
                         <p className="text-xs italic text-gray-400">No chapters added.</p>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          ) : "No course content added."
        };

        setViewData(formatted);
        setOpenView(true);
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
    }
  };

  const fields = [
    { name: "course_name", label: "Course Name", type: "text", required: true },
    {
      name: "course_description",
      label: "Course Description",
      type: "textarea",
      required: true,
    },
    {
      name: "course_category_id",
      label: "Category",
      type: "select",
      options: categoryOptions,
      required: true,
    },
    {
      name: "course_type",
      label: "Course Type",
      type: "multi-select",
      multiple: true,
      options: [
        { label: "Offline", value: "1" },
        { label: "Online", value: "2" },
      ],
      required: false,
    },
    { name: "course_rating", label: "Rating", type: "text", required: false },
    { name: "course_duration", label: "Duration (Hours)", type: "text", required: false },
    { name: "course_fee", label: "Fee", type: "number", required: false },
    {
      name: "course_overview",
      label: "Course Overview",
      type: "textarea",
      required: false,
    },
    {
      name: "course_syllabus",
      label: "Course Syllabus",
      type: "textarea",
      required: false,
    },
    {
      name: "course_study_material",
      label: "Study Material",
      type: "textarea",
      required: false,
    },
    {
      name: "course_syllabus_file",
      label: "Syllabus File (PDF)",
      type: "file",
      required: false,
    },
    {
      name: "course_questions_file",
      label: "Questions File (PDF)",
      type: "file",
      required: false,
    },
    {
      name: "course_image",
      label: "Course Image - (Ratio: 3:2)",
      type: "file",
      required: false,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
      required: true,
    },
    {
      name: "modules",
      label: "Course Content",
      type: "module-chapters",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Courses</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ],
              },
              {
                key: "category_id",
                label: "Category",
                options: categoryOptions,
              },
            ]}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />

          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition shadow-md"
          >
            Create Course <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "course_name", label: "Name" },
          {
            key: "category",
            label: "Category",
            render: (r) => r.category?.category_name || "—",
          },
          {
            key: "course_type",
            label: "Course Type",
            render: (r: any) => {
              const raw = r.course_type;
              let values: number[] = [];
              if (Array.isArray(raw)) {
                values = raw.map((v) => Number(v));
              } else if (typeof raw === "string") {
                try {
                  const parsed = JSON.parse(raw);
                  if (Array.isArray(parsed)) {
                    values = parsed.map((v) => Number(v));
                  }
                } catch {
                  // ignore
                }
              } else if (typeof raw === "number") {
                values = [raw];
              }

              if (!values.length) return "—";

              const labels = values
                .map((v) => {
                  if (v === 1) return "Offline";
                  if (v === 2) return "Online";
                  return null;
                })
                .filter(Boolean);

              return labels.length ? labels.join(", ") : "—";
            },
          },
          { key: "course_rating", label: "Rating" },
          { key: "course_fee", label: "Fee" },
          { key: "course_duration", label: "Duration" },
          {
            key: "course_image",
            label: "Image",
            render: (r) =>
              r.course_image ? (
                <img
                  src={server_url + r.course_image}
                  className="w-10 h-10 object-cover rounded-full border shadow-sm"
                  alt="Class"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "status",
            label: "Status",
            render: (r: any) =>
              r.status == 1 || r.status === "1" ? (
                <div className="bg-green-100 text-green-800 w-fit px-3 py-0.5 rounded-full text-xs font-semibold">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 w-fit px-3 py-0.5 rounded-full text-xs font-semibold">
                  Inactive
                </div>
              ),
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={async (row: any) => {
          try {
            // Fetch the full course including modules/chapters for editing
            const fullRes = await getCourseById(row.course_id, true, true);
            const r = fullRes.data;

            setSelected({
              ...r,
              course_category_id: String(r.course_category_id),
              status: String(r.status),
              course_type: (() => {
                const ct = r.course_type;
                if (Array.isArray(ct)) return ct;
                if (typeof ct === "string") {
                  try {
                    const parsed = JSON.parse(ct);
                    return Array.isArray(parsed) ? parsed : [];
                  } catch {
                    return [];
                  }
                }
                if (typeof ct === "number") return [ct];
                return [];
              })(),
              // Ensure modules are loaded for the editor
              modules: r.modules || [],
            });
            setOpenForm(true);
          } catch (error) {
            console.error("Error fetching full course for edit:", error);
          }
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      <DynamicFormModal
        title={selected ? "Edit Course" : "Create Course"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateFullCourse(selected.course_id, fd);
          else await createFullCourse(fd);
        }}
        onSuccess={loadCourses}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCourse(selected.course_id);
            setOpenDelete(false);
            loadCourses();
          }
        }}
        title="Delete Course"
        message={`Are you sure you want to delete "${selected?.course_name}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Course"
        data={viewData}
      />
    </div>
  );
}
