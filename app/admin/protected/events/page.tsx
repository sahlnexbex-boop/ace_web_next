"use client";

import { useState, useEffect } from "react";
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
import { IconPlus } from "@tabler/icons-react";

export default function EventsPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<Record<string, any> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const loadEvents = async () => {
    try {
      const res = await getEvents(page, 10, debouncedSearch);
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, debouncedSearch]);

  const handleRowClick = async (row: any) => {
    try {
      const res = await getEventById(row.event_id);
      const e = res?.data || res;

      // 🧩 Format view data (consistent across all pages)
      const formatted: Record<string, React.ReactNode> = {
        "Event Title": e.event_title || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {e.event_description || "—"}
          </p>
        ),
        "Event Type": e.event_type || "—",
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
              src={e.event_image}
              alt="Event"
              className="w-14 h-14 object-cover rounded"
            />
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
      type: "number",
      required: true,
    },
    {
      name: "event_location",
      label: "Event Location",
      type: "text",
      required: true,
    },
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
    {
      name: "event_image",
      label: "Event Image",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Events</h1>
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

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "event_title", label: "Title" },
          { key: "event_location", label: "Location" },
          {
            key: "event_type",
            label: "Type",
            render: (r) => r.event_type || "—",
          },
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
                  src={r.event_image}
                  className="w-10 h-10 object-cover rounded-md"
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
              r.status === 1 || r.status === "1" ? (
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
            date_time: row.date_time
              ? new Date(row.date_time).toISOString().slice(0, 16)
              : "",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
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

      {/* Delete Modal */}
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

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Event Details"
        data={viewData}
      />
    </div>
  );
}
