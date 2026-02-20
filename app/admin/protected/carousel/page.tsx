"use client";

import { useState, useEffect, useMemo } from "react";
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

const BUTTON_TYPES: Record<number, string> = {
  1: "For Admission",
  2: "For Enquiry",
  3: "For Tuition",
  4: "For Scholarship",
  5: "For Interview",
};

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
  const [buttonType1, setButtonType1] = useState<string>("");
  const [buttonType2, setButtonType2] = useState<string>("");

  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  // helper to detect video files (only mp4 right now)
  const isVideoFile = (path?: string) =>
    !!path && path.toLowerCase().endsWith(".mp4");

  // open media in a new tab; videos are wrapped in a simple player so they don't download
  const openMedia = (url: string, isVideo: boolean) => {
    if (isVideo) {
      const newWin = window.open("", "_blank");
      if (newWin) {
        newWin.document.write(`
          <!doctype html>
          <html>
            <head><title>Video preview</title></head>
            <body style="margin:0;background:#000;">
              <video src="${url}" controls autoplay style="width:100%;height:100%;" />
            </body>
          </html>
        `);
        newWin.document.close();
      }
    } else {
      window.open(url, "_blank");
    }
  };

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
        "Badge Text": c.badge_text || "—",
        "Badge URL": c.badge_url ? (
          <a
            href={c.badge_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 underline"
          >
            {c.badge_url}
          </a>
        ) : (
          "—"
        ),
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {c.carousel_description || "—"}
          </p>
        ),
        "Button 1 Type": c.button_type_1
          ? BUTTON_TYPES[c.button_type_1] || `Type ${c.button_type_1}`
          : "—",
        "Button 1 Link": c.button_1_link || "—",
        "Button 2 Type": c.button_type_2
          ? BUTTON_TYPES[c.button_type_2] || `Type ${c.button_type_2}`
          : "—",
        "Button 2 Link": c.button_2_link || "—",
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
        "Carousel File": c.carousel_file ? (() => {
          const url = server_url + c.carousel_file;
          const video = isVideoFile(c.carousel_file);
          return (
            <div
              className="flex justify-end max-w-32"
              onClick={() => openMedia(url, video)}
              style={{ cursor: "pointer" }}
            >
              {video ? (
                <div className="w-32 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                  video file, click
                </div>
              ) : (
                <img
                  src={url}
                  className="w-32 h-16 object-cover"
                  alt="carousel"
                />
              )}
            </div>
          );
        })() : (
          "—"
        ),
        "Carousel Mobile File": c.carousel_mobile_file ? (() => {
          const url = server_url + c.carousel_mobile_file;
          const video = isVideoFile(c.carousel_mobile_file);
          return (
            <div
              className="flex justify-end max-w-12"
              onClick={() => openMedia(url, video)}
              style={{ cursor: "pointer" }}
            >
              {video ? (
                <div className="w-12 h-20 bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                  video file, click
                </div>
              ) : (
                <img
                  src={url}
                  className="w-12 h-20 object-cover"
                  alt="carousel"
                />
              )}
            </div>
          );
        })() : (
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

  const fields = useMemo(
    () => [
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
        name: "badge_text",
        label: "Badge Text",
        type: "text",
        required: false,
      },
      {
        name: "badge_url",
        label: "Badge URL",
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
        name: "button_type_1",
        label: "Button 1 Type",
        type: "select",
        options: Object.entries(BUTTON_TYPES).map(([value, label]) => ({
          label,
          value,
        })),
        required: false,
        onChange: (val: string) => {
          setButtonType1(val);
        },
      },
      {
        name: "button_1_link",
        label: "Button 1 Link (for types 3–5)",
        type: "text",
        required: false,
        disabled: buttonType1 === "1" || buttonType1 === "2",
      },
      {
        name: "button_type_2",
        label: "Button 2 Type",
        type: "select",
        options: Object.entries(BUTTON_TYPES).map(([value, label]) => ({
          label,
          value,
        })),
        required: false,
        onChange: (val: string) => {
          setButtonType2(val);
        },
      },
      {
        name: "button_2_link",
        label: "Button 2 Link (for types 3–5)",
        type: "text",
        required: false,
        disabled: buttonType2 === "1" || buttonType2 === "2",
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
    ],
    [buttonType1, buttonType2]
  );

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
              setButtonType1("");
              setButtonType2("");
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
          {
            key: "carousel_title",
            label: "Title",
            render: (r) => (
              <div className="truncate max-w-[100px]" title={r.carousel_title}>
                {r.carousel_title || "—"}
              </div>
            ),
          },
          // {
          //   key: "carousel_sec_title",
          //   label: "Sub Title",
          //   render: (r) => (
          //     <div
          //       className="truncate max-w-[200px]"
          //       title={r.carousel_sec_title}
          //     >
          //       {r.carousel_sec_title || "—"}
          //     </div>
          //   ),
          // },
          // {
          //   key: "badge_text",
          //   label: "Badge",
          //   render: (r) => (
          //     <div
          //       className="truncate max-w-[120px]"
          //       title={r.badge_text}
          //     >
          //       {r.badge_text || "—"}
          //     </div>
          //   ),
          // },
          {
            key: "button_type_1",
            label: "Button 1 Type",
            render: (r) =>
              r.button_type_1
                ? BUTTON_TYPES[r.button_type_1] ||
                  `Type ${r.button_type_1}`
                : "—",
          },
          {
            key: "button_type_2",
            label: "Button 2 Type",
            render: (r) =>
              r.button_type_2
                ? BUTTON_TYPES[r.button_type_2] ||
                  `Type ${r.button_type_2}`
                : "—",
          },
          // {
          //   key: "carousel_description",
          //   label: "Description",
          //   render: (r) => (
          //     <div
          //       className="truncate max-w-[250px]"
          //       title={r.carousel_description}
          //     >
          //       {r.carousel_description || "—"}
          //     </div>
          //   ),
          // },
          {
            key: "carousel_file",
            label: "PC File",
            render: (r) => {
              if (!r.carousel_file) return "—";
              const url = server_url + r.carousel_file;
              const video = isVideoFile(r.carousel_file);

              return (
                <div
                  className="max-w-32 h-10 rounded-sm overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMedia(url, video);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {video ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                      video file, click
                    </div>
                  ) : (
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="file"
                    />
                  )}
                </div>
              );
            },
          },
          {
            key: "carousel_mobile_file",
            label: "Mobile File",
            render: (r) => {
              if (!r.carousel_mobile_file) return "—";
              const url = server_url + r.carousel_mobile_file;
              const video = isVideoFile(r.carousel_mobile_file);

              return (
                <div
                  className="max-w-20 h-12 rounded-sm overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMedia(url, video);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {video ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                      video file, click
                    </div>
                  ) : (
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="file"
                    />
                  )}
                </div>
              );
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
          const bt1 = row.button_type_1 ? String(row.button_type_1) : "";
          const bt2 = row.button_type_2 ? String(row.button_type_2) : "";
          setButtonType1(bt1);
          setButtonType2(bt2);
          setSelected({
            ...row,
            status: String(row.status),
            button_type_1: bt1,
            button_type_2: bt2,
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
        onClose={() => {
          setOpenForm(false);
          setButtonType1("");
          setButtonType2("");
        }}
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
