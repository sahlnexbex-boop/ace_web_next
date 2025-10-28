"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  getPublicationCategories,
} from "@/lib/api/publication";
import { IconPlus } from "@tabler/icons-react";

export default function PublicationPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<Record<string, any> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const loadPublications = async () => {
    try {
      const res = await getPublications(page, 10, debouncedSearch);
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading publications:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getPublicationCategories();
      setCategories(res?.data || res || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    loadPublications();
  }, [page, debouncedSearch]);

  // 🔹 Handle row click - open view modal
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
        "Author": p.book_author || "—",
        "Language": p.book_language || "—",
        "Category ID": p.category_id || "—",
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
        "Status":
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
        // "Created By": p.created_by || "—",
        // "Updated By": p.updated_by || "—",
        // "Book ID": p.book_id || "—",
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
    { name: "book_image", label: "Book Image", type: "file", required: false },
    { name: "book_file", label: "Book File", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Publications</h1>
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

      {/* Data Table */}
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
            key: "book_image",
            label: "Image",
            render: (r) =>
              r.book_image ? (
                <img
                  src={r.book_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Book"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "book_file",
            label: "File",
            render: (r) =>
              r.book_file ? (
                <a
                  href={r.book_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 underline"
                >
                  View File
                </a>
              ) : (
                "—"
              ),
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

      {/* Modals */}
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
