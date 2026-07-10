"use client";

import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getCourseTypes,
  createCourseType,
  updateCourseType,
  deleteCourseType,
  getCourseTypeById,
} from "@/lib/api/courseType";

export default function CourseTypesPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [v2Categories, setV2Categories] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  // Fetch V2 categories
  useEffect(() => {
    const fetchV2Categories = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_ACEAPP_V2_URL}/course_mang/categories/`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setV2Categories(data);
        }
      } catch (err) {
        console.error("Error fetching V2 categories:", err);
      }
    };
    fetchV2Categories();
  }, []);

  const loadData = async () => {
    const res = await getCourseTypes(page, debouncedSearch, 10, filters);
    setData(res.data || []);
    setTotalPages(res.totalPages || 1);
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getCourseTypeById(row.type_id);
      if (!res?.data) return;
      const t = res.data;
      const v2Cat = t.V2_category
        ? v2Categories.find((c) => String(c.id) === String(t.V2_category))
        : null;

      const formatted = {
        "Course Type Name": t.type_name || "—",
        "V2 Connected Category": v2Cat ? `${v2Cat.name} ( ID : ${v2Cat.id} )` : "—",
        Status:
          t.status === 1 || t.status === "1" ? (
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
    } catch (err) {
      console.error("Error fetching course type details:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Course Types</h1>

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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Type <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "type_name", label: "Type Name" },
          {
            key: "V2_category",
            label: "V2 Connected Category",
            render: (r) => {
              if (!r.V2_category) return "—";
              const v2Cat = v2Categories.find(
                (c) => String(c.id) === String(r.V2_category)
              );
              return v2Cat ? `${v2Cat.name} ( ID : ${v2Cat.id} )` : `ID: ${r.V2_category}`;
            },
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 ? (
                <span className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </span>
              ),
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(r) => {
          setSelected({
            ...r,
            V2_category: r.V2_category ? String(r.V2_category) : "",
          });
          setOpenForm(true);
        }}
        onDelete={(r) => {
          setSelected(r);
          setOpenDelete(true);
        }}
        onRowClick={handleView} 
      />

      <DynamicFormModal
        title={selected ? "Edit Course Type" : "Create Course Type"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "type_name",
            label: "Course Type Name",
            type: "text",
            required: true,
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
            name: "V2_category",
            label: "V2 Connected Category",
            type: "select",
            options: v2Categories.map((c) => ({
              label: c.name,
              value: String(c.id),
            })),
            required: false,
          },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          const payload = {
            type_name: fd.get("type_name"),
            status: fd.get("status"),
            V2_category: fd.get("V2_category") ? Number(fd.get("V2_category")) : null,
          };
          if (selected) await updateCourseType(selected.type_id, payload);
          else await createCourseType(payload);
        }}
        onSuccess={loadData}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCourseType(selected.type_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Course Type"
        message={`Are you sure you want to delete "${selected?.type_name}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Course Type"
        data={viewData}
      />
    </div>
  );
}
