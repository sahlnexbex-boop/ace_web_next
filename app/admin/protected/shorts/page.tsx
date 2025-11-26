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
  getShorts,
  getShortById,
  createShort,
  updateShort,
  deleteShort,
} from "@/lib/api/shorts";

export default function ShortsPage() {
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const loadShorts = async () => {
    try {
      const res = await getShorts(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.totalPages || res?.total || 1);
    } catch (err) {
      console.error("Error loading shorts:", err);
    }
  };

  useEffect(() => {
    loadShorts();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getShortById(row.shorts_id);
      const s = res?.data || res;

      const formatted = {
        "Shorts Title": s.shorts_title || "—",
        "Shorts Link": s.shorts_link ? (
          <a
            href={s.shorts_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 underline"
          >
            {s.shorts_link}
          </a>
        ) : (
          "—"
        ),
        "Shorts File": s.shorts_file ? (
          <a
            href={s.shorts_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 underline"
          >
            View File
          </a>
        ) : (
          "—"
        ),
        Status:
          s.status == 1 || s.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Created At": s.created_at
          ? new Date(s.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": s.updated_at
          ? new Date(s.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load shorts details", err);
    }
  };

  const fields = [
    {
      name: "shorts_title",
      label: "Shorts Title",
      type: "text",
      required: true,
    },
    {
      name: "shorts_link",
      label: "Shorts Link",
      type: "text",
      required: false,
    },
    {
      name: "shorts_file",
      label: "Shorts File - (Ratio 9:16)",
      type: "file",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Shorts</h1>

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
            Create Shorts <IconPlus size={20} />
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
          { key: "shorts_title", label: "Title" },
          {
            key: "shorts_link",
            label: "Link",
            render: (r) =>
              r.shorts_link ? (
                <a
                  href={r.shorts_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Open
                </a>
              ) : (
                "—"
              ),
          },
          {
            key: "shorts_file",
            label: "Thumbnail",
            render: (r) =>
              r.shorts_file ? (
                <a
                  href={r.shorts_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <img src={r.shorts_file} className="w-10 h-16 object-cover" />
                </a>
              ) : (
                "—"
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
        title={selected ? "Edit Shorts" : "Create Shorts"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateShort(selected.shorts_id, fd);
          else await createShort(fd);
        }}
        onSuccess={loadShorts}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteShort(selected.shorts_id);
            setOpenDelete(false);
            loadShorts();
          }
        }}
        title="Delete Shorts"
        message={`Are you sure you want to delete "${selected?.shorts_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Shorts"
        data={viewData}
      />
    </div>
  );
}
