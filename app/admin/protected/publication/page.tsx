"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  getPublicationCategories,
} from "@/lib/api/publication";

export default function PublicationPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  // Load list
  const loadPublications = async () => {
    try {
      const res = await getPublications(page, 10, debouncedSearch);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading publications:", err);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await getPublicationCategories();
      setCategories(res || []);
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

  const categoryOptions = categories.map((c) => ({
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
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Publications
        </h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Publication
        </button>
      </div>

      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, idx) => idx + 1 + (page - 1) * 10,
          },
          { key: "book_id", label: "ID" },
          { key: "book_title", label: "Title" },
          { key: "book_author", label: "Author" },
          { key: "book_language", label: "Language" },
          {
            key: "book_price",
            label: "Price",
            render: (r) => `₹${r.book_price}`,
          },
          {
            key: "book_image",
            label: "Image",
            render: (r) =>
              r.book_image ? (
                <img
                  src={r.book_image}
                  className="w-10 h-10 object-cover rounded-full"
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
              r.status ? (
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
            category_id: String(row.category_id),
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
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
    </div>
  );
}
