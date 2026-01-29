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
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/api/events";

export default function EventsPage() {
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string; event_type?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const debouncedSearch = useDebounce(search, 500);

  const loadEvents = async () => {
    try {
      const res = await getEvents(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined,
        filters.event_type ? Number(filters.event_type) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getEventById(row.event_id);
      const e = res?.data || res;

      // Parse other_images if it's a JSON string
      let otherImages: string[] = [];
      if (e.other_images) {
        try {
          otherImages = typeof e.other_images === 'string' 
            ? JSON.parse(e.other_images) 
            : Array.isArray(e.other_images) 
            ? e.other_images 
            : [];
        } catch (err) {
          console.error("Failed to parse other_images:", err);
          otherImages = [];
        }
      }

      const formatted = {
        "Event Title": e.event_title || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">{e.event_description || "—"}</p>
        ),
        "Event Type": e.event_type === 1 ? "Online" : e.event_type === 2 ? "Offline" : "—",
        "Event Location": e.event_location || "—",
        "Event Date & Time": e.date_time
          ? new Date(e.date_time).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "—",
        Status:
          e.status === 1 || e.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Event Image": e.event_image ? (
          <div className="flex justify-end">
            <img
              src={server_url +e.event_image}
              alt="Event"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        ) : (
          "—"
        ),
        "Other Images": otherImages.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-end">
            {otherImages.map((img, idx) => (
              <img
                key={idx}
                src={server_url + img}
                alt={`Other ${idx + 1}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        ) : (
          "—"
        ),
        "Created At": e.created_at
          ? new Date(e.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": e.updated_at
          ? new Date(e.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load event details:", err);
    }
  };

  const fields = [
    { name: "event_title", label: "Event Title", type: "text", required: true },
    {
      name: "event_description",
      label: "Event Description",
      type: "textarea",
      required: true,
    },
    {
      name: "event_type",
      label: "Event Type",
      type: "select",
      options: [
        { label: "Online", value: "1" },
        { label: "Offline", value: "2" },
      ],
      required: true,
    },
    { name: "event_location", label: "Event Location", type: "text", required: true },
    {
      name: "date_time",
      label: "Event Date & Time",
      type: "datetime-local",
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
    { name: "event_image", label: "Event Image - (Ratio 3:2)", type: "file", required: false },
    { name: "other_images", label: "Other Images (Multiple)", type: "file", required: false, multiple: true },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Events</h1>

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
                key: "event_type",
                label: "Event Type",
                options: [
                  { label: "Online", value: "1" },
                  { label: "Offline", value: "2" },
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
            Create Event <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "event_title", label: "Title" },
          {
            key: "event_type",
            label: "Type",
            render: (r) =>
              r.event_type === 1 || r.event_type === "1"
                ? "Online"
                : r.event_type === 2 || r.event_type === "2"
                ? "Offline"
                : "—",
          },
          { key: "event_location", label: "Location" },
          {
            key: "date_time",
            label: "Date & Time",
            render: (r) =>
              r.date_time
                ? new Date(r.date_time).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—",
          },
          {
            key: "event_image",
            label: "Image",
            render: (r) =>
              r.event_image ? (
                <img
                  src={server_url + r.event_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Event"
                />
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
          // Parse other_images if it's a JSON string
          let otherImages: string[] = [];
          if (row.other_images) {
            try {
              otherImages = typeof row.other_images === 'string' 
                ? JSON.parse(row.other_images) 
                : Array.isArray(row.other_images) 
                ? row.other_images 
                : [];
            } catch (err) {
              console.error("Failed to parse other_images:", err);
              otherImages = [];
            }
          }

          setSelected({
            ...row,
            status: String(row.status),
            event_type: String(row.event_type),
            date_time: row.date_time
              ? new Date(row.date_time).toISOString().slice(0, 16)
              : "",
            other_images: otherImages,
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
        title={selected ? "Edit Event" : "Create Event"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateEvent(selected.event_id, fd);
          else await createEvent(fd);
        }}
        onSuccess={loadEvents}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteEvent(selected.event_id);
            setOpenDelete(false);
            loadEvents();
          }
        }}
        title="Delete Event"
        message={`Are you sure you want to delete "${selected?.event_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Event"
        data={viewData}
      />
    </div>
  );
}
