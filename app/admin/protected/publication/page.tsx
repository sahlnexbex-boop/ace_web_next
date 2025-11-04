"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button"; 
import { useDebounce } from "@/hooks/debounce";

import {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
} from "@/lib/api/publication";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function PublicationPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<Record<string, any> | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const loadCategories = async () => {
    try {
      const res = await getCourseCategories();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCategories(list);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadPublications = async () => {
    try {
      const status =
        filters.status && filters.status !== "" ? Number(filters.status) : undefined;
      const category_id =
        filters.category_id && filters.category_id !== ""
          ? Number(filters.category_id)
          : undefined;

      const res = await getPublications(
        page,
        10,
        debouncedSearch,
        status,
        category_id
      );

      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading publications:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPublications();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getPublicationById(row.book_id);
      const p = res?.data || res;

      const formatted: Record<string, any> = {
        "Book Title": p.book_title,
        "Description": (
          <p className="text-gray-700 whitespace-pre-line">
            {p.book_description || "—"}
          </p>
        ),
        "Book Price": p.book_price ? `₹${p.book_price}` : "—",
        Author: p.book_author || "—",
        Language: p.book_language || "—",
        Category:
          categories.find((c) => c.category_id === p.category_id)?.category_name ||
          "—",
        "Book Image": p.book_image ? (
          <div className="flex justify-end">
            <img
              src={p.book_image}
              alt="Book"
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>
        ) : (
          "—"
        ),
        "Book File": p.book_file ? (
          <a
            href={p.book_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 underline"
          >
            {p.book_file}
          </a>
        ) : (
          "—"
        ),
        Status:
          p.status === 1 || p.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Created At": p.created_at
          ? new Date(p.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": p.updated_at
          ? new Date(p.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Error fetching publication details:", err);
    }
  };

  const categoryOptions = categories.map((c: any) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  const fields = [
    { name: "book_title", label: "Book Title", type: "text", required: true },
    {
      name: "book_description",
      label: "Book Description",
      type: "textarea",
      required: true,
    },
    { name: "book_price", label: "Book Price", type: "text", required: true },
    { name: "book_author", label: "Author", type: "text", required: true },
    { name: "book_language", label: "Language", type: "text", required: true },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categoryOptions,
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
    { name: "book_image", label: "Book Image - (Ratio 190x270)", type: "file", required: false },
    { name: "book_file", label: "Book File (PDF)", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Publications</h1>

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
                options: [
                  ...categoryOptions,
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
            Create Publication <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "book_title", label: "Title" },
          { key: "book_author", label: "Author" },
          { key: "book_language", label: "Language" },
          {
            key: "book_price",
            label: "Price",
            render: (r) => (r.book_price ? `₹${r.book_price}` : "—"),
          },
          {
            key: "category_id",
            label: "Category",
            render: (r) =>
              categories.find((c) => c.category_id === r.category_id)
                ?.category_name || "—",
          },
          { 
             key: "book_image",
             label: "Image",
             render: (r) => (
               <div className="flex gap-1">
                 {r.book_image ? (
                   <img
                     src={r.book_image}
                     className="w-8 h-8 rounded object-cover"
                     alt="Book"
                   />
                 ) : (
                   "—"
                 )}
               </div>
             )
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status === 1 || r.status === "1" ? (
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
        onEdit={(row) => {
          setSelected({
            ...row,
            category_id: String(row.category_id),
            status: String(row.status),
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
        title={selected ? "Edit Publication" : "Create Publication"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updatePublication(selected.book_id, fd);
          else await createPublication(fd);
        }}
        onSuccess={loadPublications}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deletePublication(selected.book_id);
            setOpenDelete(false);
            loadPublications();
          }
        }}
        title="Delete Publication"
        message={`Are you sure you want to delete "${selected?.book_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Publication Details"
        data={viewData}
      />
    </div>
  );
}
