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
  getCarousels,
  getCarouselById,
  createCarousel,
  updateCarousel,
  deleteCarousel,
} from "@/lib/api/carousel";

export default function CarouselPage() {
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

  const loadCarousels = async () => {
    try {
      const res = await getCarousels(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading carousels:", err);
    }
  };

  useEffect(() => {
    loadCarousels();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getCarouselById(row.carousel_id);
      const c = res?.data || res;

      const formatted = {
        "Carousel Title": c.carousel_title || "—",
        "Secondary Title": c.carousel_sec_title || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {c.carousel_description || "—"}
          </p>
        ),
        Status:
          c.status == 1 || c.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Carousel File": c.carousel_file ? (
          <a
            href={c.carousel_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 underline"
          >
            {c.carousel_file}
          </a>
        ) : (
          "—"
        ),
         "Carousel Mobile File": c.carousel_mobile_file ? (
          <a
            href={c.carousel_mobile_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 underline"
          >
            {c.carousel_mobile_file}
          </a>
        ) : (
          "—"
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
      console.error("Failed to load carousel details:", err);
    }
  };

  const fields = [
    {
      name: "carousel_title",
      label: "Carousel Title",
      type: "text",
      required: false,
    },
    {
      name: "carousel_sec_title",
      label: "Secondary Title",
      type: "text",
      required: false,
    },
    {
      name: "carousel_description",
      label: "Description",
      type: "textarea",
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
      name: "carousel_file",
      label: "Carousel File - (Ratio 16:9)",
      type: "file",
      required: true,
    },
    {
      name: "carousel_mobile_file",
      label: "Mobile File - (Ratio 9:16)",
      type: "file",
      required: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Carousel</h1>

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
            Create Carousel <IconPlus size={20} />
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
          { key: "carousel_title", label: "Title", render: (r) => r.carousel_title|| "—" },
          { key: "carousel_sec_title", label: "Sub Title", render: (r) => r.carousel_sec_title|| "—" },
          {
            key: "carousel_description",
            label: "Description",
            render: (r) => (
              <div
                className="truncate max-w-[250px]"
                title={r.carousel_description}
              >
                {r.carousel_description || "—"}
              </div>
            ),
          },
          {
            key: "carousel_file",
            label: "File",
            render: (r) =>
              r.carousel_file ? (
               <a
                  href={r.carousel_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              ) : (
                "—"
              ),
          },
          {
            key: "carousel_mobile_file",
            label: "File",
            render: (r) =>
              r.carousel_mobile_file ? (
               <a
                  href={r.carousel_mobile_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
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
        title={selected ? "Edit Carousel" : "Create Carousel"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCarousel(selected.carousel_id, fd);
          else await createCarousel(fd);
        }}
        onSuccess={loadCarousels}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCarousel(selected.carousel_id);
            setOpenDelete(false);
            loadCarousels();
          }
        }}
        title="Delete Carousel"
        message={`Are you sure you want to delete "${selected?.carousel_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Carousel"
        data={viewData}
      />
    </div>
  );
}
