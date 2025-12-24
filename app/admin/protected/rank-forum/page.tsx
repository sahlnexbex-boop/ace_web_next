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
  getRankForums,
  getRankForumById,
  createRankForum,
  updateRankForum,
  deleteRankForum,
} from "@/lib/api/rankForum";

import { getCourseCategories } from "@/lib/api/courseCategory";

const REQUEST_STATUS_MAP: Record<string, string> = {
  "1": "Pending",
  "2": "Approved",
  "3": "Rejected",
};

export default function RankForumPage() {
  const [data, setData] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const debouncedSearch = useDebounce(search, 500);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Load departments
  const loadDepartments = async () => {
    const res = await getCourseCategories(1, 200, "");
    setDepartments(res?.data || []);
  };

  // Load rank forums
  const loadData = async () => {
    const status =
      filters.status && filters.status !== ""
        ? Number(filters.status)
        : undefined;

    const department_id =
      filters.department_id && filters.department_id !== ""
        ? Number(filters.department_id)
        : undefined;

    const request_status =
      filters.request_status && filters.request_status !== ""
        ? Number(filters.request_status)
        : undefined;

    const res = await getRankForums(
      page,
      10,
      debouncedSearch,
      status,
      department_id,
      request_status
    );

    setData(res?.data || []);
    setTotalPages(res?.totalPages || 1);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  const departmentOptions = departments.map((d) => ({
    label: d.category_name,
    value: String(d.category_id),
  }));

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Rank Forum</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "department_id",
                label: "Department",
                type: "select",
                options: departmentOptions,
              },
              {
                key: "request_status",
                label: "Request Status",
                type: "select",
                options: [
                  { label: "Pending", value: "1" },
                  { label: "Approved", value: "2" },
                  { label: "Rejected", value: "3" },
                ],
              },
              {
                key: "status",
                label: "Status",
                type: "select",
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
            className="bg-cyan-700 cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Forum<IconPlus size={18} />
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
            key: "photo",
            label: "Photo",
            render: (r) =>
              r.photo ? (
                <img
                  src={server_url + r.photo}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                "—"
              ),
          },
          { key: "name", label: "Name" },
          { key: "rank", label: "Rank" },
          {
            key: "department",
            label: "Department",
            render: (r) => r.department?.category_name || "—",
          },
          {
            key: "request_status",
            label: "Request",
            render: (r) => REQUEST_STATUS_MAP[r.request_status] || "—",
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
            department_id: String(row.department_id),
            joining_date: row.joining_date?.split("T")[0],
            status: String(row.status),
            request_status: String(row.request_status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getRankForumById(row.rankforum_id);
          const r = res?.data;

          setViewData({
            Name: r.name,
            Rank: r.rank,
            Department: r.department?.category_name,
            "Mobile No": r.mobile_no,
            Email: r.email,
            Post: r.post,
            District: r.district,
            "Joining Date": new Date(r.joining_date).toLocaleDateString(
              "en-IN"
            ),
            "Request Status": REQUEST_STATUS_MAP[r.request_status],
            Photo: r.photo ? (
              <img
                src={server_url + r.photo}
                className="w-16 h-16 rounded object-cover"
              />
            ) : (
              "—"
            ),
          });

          setOpenView(true);
        }}
      />

      {/* FORM */}
      <DynamicFormModal
        title={selected ? "Edit Rank Forum" : "Create Rank Forum"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        defaultValues={selected}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          {
            name: "mobile_no",
            label: "Mobile No",
            type: "text",
            required: true,
          },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "rank", label: "Rank", type: "text", required: true },
          {
            name: "department_id",
            label: "Department",
            type: "select",
            options: departmentOptions,
            required: true,
          },
          {
            name: "name_of_office",
            label: "Office",
            type: "text",
            required: true,
          },
          { name: "post", label: "Post", type: "text", required: true },
          { name: "district", label: "District", type: "text", required: true },
          {
            name: "joining_date",
            label: "Joining Date",
            type: "date",
            required: true,
          },
          {
            name: "request_status",
            label: "Request Status",
            type: "select",
            options: [
              { label: "Pending", value: "1" },
              { label: "Approved", value: "2" },
              { label: "Rejected", value: "3" },
            ],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
          { name: "photo", label: "Photo", type: "file" },
        ]}
        onSubmit={async (fd) => {
          if (selected) await updateRankForum(selected.rankforum_id, fd);
          else await createRankForum(fd);
        }}
        onSuccess={loadData}
      />

      {/* DELETE */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteRankForum(selected.rankforum_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Entry"
        message={`Delete "${selected?.name}"?`}
      />

      {/* VIEW */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Rank Forum Details"
        data={viewData}
      />
    </div>
  );
}
