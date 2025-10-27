"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import { useDebounce } from "@/hooks/debounce";
import { IconPlus } from '@tabler/icons-react';

import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/user";

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const loadUsers = async () => {
    try {
      const res = await getUsers(page, debouncedSearch, 10);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch]);

  const fields = [
    { name: "user_name", label: "User Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: !selected },
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
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-semibold text-cyan-700">Users</h1>
        <button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
        >
          Add User <IconPlus size={20} />
        </button>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, idx) => idx + 1 + (page - 1) * 10 },
          { key: "user_name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status
                ? <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">Active</div>
                : <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">Inactive</div>
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => { setSelected(row); setOpenForm(true); }}
        onDelete={(row) => { setSelected(row); setOpenDelete(true); }}
      />

      <DynamicFormModal
        title={selected ? "Edit User" : "Create User"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd) => {
          const payload: any = {};
          fd.forEach((value, key) => {
            if (key === "status") payload[key] = Number(value); // convert status to 0/1
            else payload[key] = value;
          });

          if (selected) await updateUser(selected.user_id, payload);
          else await createUser(payload);
        }}
        onSuccess={loadUsers}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteUser(selected.user_id);
            setOpenDelete(false);
            loadUsers();
          }
        }}
        title="Delete User"
        message={`Are you sure you want to delete "${selected?.user_name}"?`}
      />
    </div>
  );
}
