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
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/api/user";

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
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

  // ✅ Load Users
  const loadData = async () => {
    try {
      const res = await getUsers(page, debouncedSearch, 10, filters);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Users</h1>

        <div className="flex items-center gap-3">
          {/* ✅ Reusable Filter Button */}
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

          {/* ✅ Create Button */}
          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Add User <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* ✅ Data Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "user_name", label: "User Name" },
          { key: "email", label: "Email" },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status === "1" ? (
                <span className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </span>
              ),
          },
          {
            key: "created_at",
            label: "Created At",
            render: (r) =>
              new Date(r.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(r) => {
          setSelected(r);
          setOpenForm(true);
        }}
        onDelete={(r) => {
          setSelected(r);
          setOpenDelete(true);
        }}
        onRowClick={async (r) => {
          const res = await getUserById(r.user_id);
          const u = res?.data;
          if (!u) return;

          const formatted = {
            "User ID": u.user_id || "—",
            "User Name": u.user_name || "—",
            Email: u.email || "—",
            Status:
              u.status == 1 || u.status === "1" ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                  Inactive
                </span>
              ),
            "Created At": u.created_at
              ? new Date(u.created_at).toLocaleString("en-IN")
              : "—",
            "Updated At": u.updated_at
              ? new Date(u.updated_at).toLocaleString("en-IN")
              : "—",
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* ✅ Create/Edit Modal */}
      <DynamicFormModal
        title={selected ? "Edit User" : "Create User"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          { name: "user_name", label: "User Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: !selected,
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
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          const payload: any = {};
          fd.forEach((value, key) => {
            payload[key] = key === "status" ? Number(value) : value;
          });
          if (selected) await updateUser(selected.user_id, payload);
          else await createUser(payload);
        }}
        onSuccess={loadData}
      />

      {/* ✅ Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteUser(selected.user_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete User"
        message={`Are you sure you want to delete "${selected?.user_name}"?`}
      />

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View User"
        data={viewData}
      />
    </div>
  );
}
