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
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "@/lib/api/review";
import { getCourses } from "@/lib/api/course"; // Fetch courses for the dropdown

export default function ReviewsPage() {
  const [data, setData] = useState<any[]>([]);
  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const debouncedSearch = useDebounce(search, 500);

  const loadReviews = async () => {
    try {
      const res = await getReviews(page, 10, debouncedSearch, filters);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await getCourses(1, 1000); // Fetch practically all active courses
      if (res?.data) {
        const courseOptions = res.data.map((c: any) => ({
          label: c.course_name,
          value: String(c.course_id),
        }));
        setCourses(courseOptions);
      }
    } catch (err) {
      console.error("Error loading courses for selector:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    loadCourses();
  }, []);

  const handleView = async (row: any) => {
    try {
      const res = await getReviewById(row.review_id);
      if (res?.data) {
        const t = res.data;

        const formatted = {
          "Course": t.course?.course_name || "—",
          "Candidate Name": t.candidate_name || "—",
          "Position": t.candidate_position || "—",
          "Place/Location": t.place || "—",
          "Rating": `${t.rating} / 5`,
          "Description": <p className="text-gray-700 whitespace-pre-line">{t.description || "—"}</p>,
          Status:
            t.status == 1 || t.status == "1" ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
            ),
          "Created At": t.created_at
            ? new Date(t.created_at).toLocaleString("en-IN")
            : "—",
          "Updated At": t.updated_at
            ? new Date(t.updated_at).toLocaleString("en-IN")
            : "—",
        };

        setViewData(formatted);
        setOpenView(true);
      }
    } catch (err) {
      console.error("Error fetching review details:", err);
    }
  };

  const fields = [
    {
      name: "course_id",
      label: "Associated Course",
      type: "select",
      options: [{ label: "None / General Review", value: "" }, ...courses],
      required: false,
    },
    { name: "candidate_name", label: "Candidate Name", type: "text", required: true },
    { name: "candidate_position", label: "Position", type: "text", required: false },
    { name: "place", label: "Place/Location", type: "text", required: false },
    { name: "rating", label: "Rating (Out of 5)", type: "number", step: "0.1", min: "0", max: "5", required: true },
    { name: "description", label: "Review Content", type: "textarea", required: true },
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
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Reviews</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "course_id",
                label: "Course",
                options: courses,
              },
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ],
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
            className="bg-cyan-700 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Review <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "candidate_name", label: "Candidate Name" },
          { key: "rating", label: "Rating", render: (r) => `${r.rating} / 5` },
          { key: "course", label: "Course", render: (r) => r.course?.course_name || "General" },
          {
            key: "description",
            label: "Content",
            render: (r) => (
              <div className="truncate max-w-[250px]" title={r.description}>
                {r.description || "—"}
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status === "1" ? (
                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
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
        onEdit={(row) => {
          setSelected({ 
            ...row, 
            status: String(row.status), 
            course_id: row.course_id ? String(row.course_id) : "" 
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      <DynamicFormModal
        title={selected ? "Edit Review" : "Create Review"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateReview(selected.review_id, fd);
          else await createReview(fd);
        }}
        onSuccess={loadReviews}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteReview(selected.review_id);
            setOpenDelete(false);
            loadReviews();
          }
        }}
        title="Delete Review"
        message={`Are you sure you want to delete the review by "${selected?.candidate_name}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Review"
        data={viewData}
      />
    </div>
  );
}
