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
  getCourseCategories,
  getCourseCategoryById,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
} from "@/lib/api/courseCategory";
import { getCourseTypes } from "@/lib/api/courseType";

export default function CourseCategoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [courseTypes, setCourseTypes] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string; type_id?: string }>(
    {}
  );
  const [v2CategoryOptions, setV2CategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const [v2LevelNames, setV2LevelNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const loadV2CategoriesForType = async (v2TypeId: string | number) => {
    if (!v2TypeId) {
      setV2CategoryOptions([]);
      return;
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_ACEAPP_V2_URL}/course_mang/levebycategory/${v2TypeId}/`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const opts = data.map((item: any) => ({
          label: item.name,
          value: String(item.id),
        }));
        const uniqueOpts: any[] = [];
        const seen = new Set();
        for (const opt of opts) {
          if (!seen.has(opt.value)) {
            seen.add(opt.value);
            uniqueOpts.push(opt);
          }
        }
        setV2CategoryOptions(uniqueOpts);
      } else {
        setV2CategoryOptions([]);
      }
    } catch (err) {
      console.error("Error loading V2 categories by type:", err);
      setV2CategoryOptions([]);
    }
  };

  const loadCourseTypes = async () => {
    try {
      const res = await getCourseTypes(1, "", 100);
      const types = res.data || [];
      setCourseTypes(types);
    } catch (err) {
      console.error("Error loading course types:", err);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCourseCategories(page, 10, debouncedSearch, filters);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openForm) {
      loadCourseTypes();
    }
  }, [openForm]);

  useEffect(() => {
    loadCategories();
  }, [page, debouncedSearch, filters]);

  // Fetch V2 categories for the pre-selected course type when editing
  useEffect(() => {
    if (openForm && selected && selected.course_type_id && courseTypes.length > 0) {
      const selectedType = courseTypes.find((t) => String(t.type_id) === String(selected.course_type_id));
      if (selectedType && selectedType.V2_category) {
        loadV2CategoriesForType(selectedType.V2_category);
      }
    }
  }, [openForm, selected, courseTypes]);

  const typeOptions = courseTypes.map((t) => ({
    label: t.type_name,
    value: String(t.type_id),
  }));

  const handleView = async (row: any) => {
    try {
      const res = await getCourseCategoryById(row.category_id);
      if (!res?.data) return;
      const c = res.data;
      const formatted = {
        "Category Name": c.category_name || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {c.category_description || "—"}
          </p>
        ),
        "Course Type": c.courseType?.type_name || "—",
        "V2 Connected Category": c.V2_category_name
          ? `${c.V2_category_name} ( ID : ${c.V2_category} )`
          : (c.V2_category ? `ID: ${c.V2_category}` : "—"),
        "Category Image": c.category_image ? (
          <div className="flex justify-end">
            <img
              src={server_url + c.category_image}
              alt="Category"
              className="w-16 h-16 rounded object-cover"
            />
          </div>
        ) : (
          "—"
        ),
        Status:
          c.status === 1 || c.status === "1" ? (
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
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Error fetching category details:", err);
    }
  };

  const fields = [
    {
      name: "category_name",
      label: "Category Name",
      type: "text",
      required: true,
    },
    {
      name: "category_description",
      label: "Category Description",
      type: "textarea",
      required: true,
    },
    {
      name: "course_type_id",
      label: "Course Type",
      type: "select",
      options: typeOptions,
      required: true,
      onChange: (val: string) => {
        console.log("🔍 Selected Course Type ID:", val);
        const selectedType = courseTypes.find((t) => String(t.type_id) === String(val));
        console.log("🔍 Selected Type Object:", selectedType);
        if (selectedType && selectedType.V2_category) {
          console.log("🚀 Calling loadV2CategoriesForType with:", selectedType.V2_category);
          loadV2CategoriesForType(selectedType.V2_category);
        } else {
          console.log("❌ selectedType or V2_category is missing!", { selectedType });
          setV2CategoryOptions([]);
        }
      }
    },
    {
      name: "V2_category",
      label: "V2 Connected Category",
      type: "select",
      options: v2CategoryOptions,
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
      name: "category_image",
      label: "Category Image - (Ratio: 1:1)",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Course Categories
        </h1>

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
                key: "type_id",
                label: "Course Type",
                options: typeOptions,
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
              setV2CategoryOptions([]);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Category <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        isLoading={loading}
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          {
            key: "category_image",
            label: "Image",
            render: (r) =>
              r.category_image ? (
                <img
                  src={server_url + r.category_image}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                "—"
              ),
          },
          { key: "category_name", label: "Name" },
          {
            key: "category_description",
            label: "Description",
            render: (r) => (
              <p className="text-gray-700 whitespace-pre-line max-w-72 line-clamp-2">
                {r.category_description}
              </p>
            ),
          },
          {
            key: "courseType.type_name",
            label: "Course Type",
            render: (r) => r.courseType?.type_name || "—",
          },
          {
            key: "V2_category",
            label: "V2 Connected Category",
            render: (r) => {
              if (!r.V2_category) return "—";
              return r.V2_category_name ? `${r.V2_category_name} ( ID : ${r.V2_category} )` : `ID: ${r.V2_category}`;
            },
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
            course_type_id: String(row.course_type_id),
            status: String(row.status),
            V2_category: row.V2_category ? String(row.V2_category) : "",
          });
          const selectedType = courseTypes.find((t) => String(t.type_id) === String(row.course_type_id));
          if (selectedType && selectedType.V2_category) {
            loadV2CategoriesForType(selectedType.V2_category);
          } else {
            setV2CategoryOptions([]);
          }
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      <DynamicFormModal
        title={selected ? "Edit Category" : "Create Category"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCourseCategory(selected.category_id, fd);
          else await createCourseCategory(fd);
        }}
        onSuccess={loadCategories}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCourseCategory(selected.category_id);
            setOpenDelete(false);
            loadCategories();
          }
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${selected?.category_name}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Course Category"
        data={viewData}
      />
    </div>
  );
}
