"use client";

import { useEffect, useState } from "react";
import { IconBook, IconDownload, IconFileTypeXls, IconPageBreak, IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import { useRef } from "react";
import { downloadRankForumExcel } from "@/lib/api/rankForum";

import {
  getRankForums,
  getRankForumById,
  createRankForum,
  updateRankForum,
  deleteRankForum,
} from "@/lib/api/rankForum";

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
  const [openDownload, setOpenDownload] = useState(false);
  const downloadRef = useRef<HTMLDivElement | null>(null);

  const officeOptions = [
    "Agriculture Department",
    "Akshaya State Project",
    "Animal Husbandry",
    "Archaeology",
    "Archives Department",
    "Bhoomikeralam Project",
    "Kerala State Electricity Board Ltd.",
    "Kerala Water Authority",
    "Kudumbashree- State Poverty Eradication Mission",
    "Directorate of Ayurveda Medical Education",
    "Co-operative Audit",
    "Co-operative Societies",
    "Commercial Taxes",
    "Commissionerate of Civil Supplies",
    "Directorate of Civil Supplies",
    "Commissioner for Entrance Examinations",
    "Census Operations- Kerala",
    "Coir Development",
    "Directorate of Culture",
    "Dairy Development Department",
    "Directorate of Handlooms and Textiles",
    "Directorate of Medical Education",
    "Directorate of Prosecution",
    "Drugs Control Department",
    "Directorate of Economics and Statistics",
    "Environment and Climate Change",
    "Collegiate Education",
    "Public Instructions",
    "Excise Commissionerate",
    "Directorate of Vocational Higher Secondary Education",
    "Grand Kerala Shopping Festival (GKSF)",
    "IT@school Project",
    "Electrical Inspectorate",
    "Inquiry Commissioner and Special Judge- Thiruvananthapuram",
    "Jalanidhi",
    "Factories and Boilers Department",
    "Fire and Rescue Services Department",
    "Fisheries Department",
    "Food Safety Commissioner",
    "Forest Department",
    "Ground Water Department",
    "Harbour Engineering Department",
    "Directorate of Health Services",
    "Directorate of Higher Secondary Education",
    "Homoeopathic Department",
    "Hydrographic Survey Wing",
    "Indian Systems of Medicine",
    "Industrial Tribunal and Judge",
    "Industries and Commerce Directorate",
    "Industries Training",
    "Information and Public Relations",
    "IMG (Institute of Management in Government)",
    "Insurance Medical Services Department",
    "Irrigation Department",
    "Jail Department",
    "KIRTADS",
    "Kuttanad Package",
    "Kerala Medical Services Corporation Limited",
    "Kerala Minerals and Metals Limited",
    "The Kerala State Co-Operative Bank Ltd.",
    "Kerala State Industrial Development Corporation Ltd.",
    "Kerala State IT Mission",
    "Kerala State Civil Supplies Corporation",
    "Kerala State Insurance Department",
    "Kerala State Land Use Board",
    "Kerala State Planning Board",
    "Kerala State Remote Sensing and Environment Centre",
    "Kerala State Roads and Bridges Development Corporation",
    "Kerala Tourism Development Corporation Limited",
    "Labour Commissionerate",
    "Land Board",
    "Commissionerate of Land Revenue",
    "Legal Metrology Department",
    "Kerala State Audit Department",
    "MGNREGS",
    "Mining and Geology Department",
    "Motor Vehicles Department",
    "Museums and Zoos Directorate",
    "NCC Directorate",
    "National Employment Service",
    "National Rural Health Mission (NRHM)",
    "Kerala State Nirmithi Kendra",
    "Panchayat Department",
    "Police Department",
    "Ports Department",
    "Printing Directorate",
    "Public Works Department",
    "Registration Department",
    "Rural Development",
    "Sarva Shiksha Abhiyan- Kerala",
    "Sainik Welfare Department",
    "Scheduled Caste Development Department",
    "Scheduled Tribe Development Department",
    "Social Justice Directorate",
    "Sports and Youth Affairs Department",
    "State Central Library Department",
    "State Water Transport Department",
    "Stationery Department",
    "Suchitwa Mission",
    "Survey and Land Records Department",
    "Town and Country Planning Department",
    "Tourism Department",
    "Treasuries Department",
    "Urban Affairs Department",
    "Vigilance and Anti-corruption Bureau",
    "Backward Communities Development Department",
    "Directorate of Minority Welfare",
  ].map((o) => ({ label: o, value: o }));

  // Close accordion on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        downloadRef.current &&
        !downloadRef.current.contains(e.target as Node)
      ) {
        setOpenDownload(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useDebounce(search, 500);

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
    loadData();
  }, [page, debouncedSearch, filters]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Rank Forum</h1>

        <div className="flex items-center gap-3">
          <div className="relative" ref={downloadRef}>
            <button
              onClick={() => setOpenDownload((p) => !p)}
              className="flex gap-1 border border-cyan-700 text-cyan-700 px-4 py-2 rounded-md hover:text-white hover:bg-cyan-700 cursor-pointer"
            >
              <IconFileTypeXls  size={18} />
              <span>Download</span>
            </button>

            {openDownload && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                <button
                  className="w-full flex gap-2 cursor-pointer text-left px-4 py-2 text-sm hover:bg-cyan-50/80"
                  onClick={async () => {
                    setOpenDownload(false);
                    await downloadRankForumExcel({
                      page,
                      limit: 10,
                    });
                  }}
                >
                  <IconDownload size={18} className="text-cyan-800" /> <span>Current Page</span>
                </button>

                <button
                  className="w-full flex gap-2 text-left px-4 py-2 text-sm hover:bg-cyan-50/80 cursor-pointer"
                  onClick={async () => {
                    setOpenDownload(false);
                    await downloadRankForumExcel({
                      exportAll: true,
                    });
                  }}
                >
                   <IconDownload size={18} className="text-cyan-800" /> <span>Full Page</span>
                </button>
              </div>
            )}
          </div>

          <TableFilter
            fields={[
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
            Create Forum
            <IconPlus size={18} />
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
          { key: "name", label: "Name" },
          { key: "course", label: "Course" },
          { key: "batch", label: "Batch" },
          { key: "year_of_study", label: "Year" },
          { key: "reg_no", label: "Reg No" },
          {
            key: "request_status",
            label: "Request",
            render: (r) => (
              <>
                {r.request_status == 1 && (
                  <span className="bg-orange-100 px-3 py-0.5 rounded-full text-xs">
                    Pending
                  </span>
                )}
                {r.request_status == 2 && (
                  <span className="bg-green-100 px-3 py-0.5 rounded-full text-xs">
                    Approved
                  </span>
                )}
                {r.request_status == 3 && (
                  <span className="bg-red-100 px-3 py-0.5 rounded-full text-xs">
                    Rejected
                  </span>
                )}
              </>
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
            Email: r.email,
            "Mobile No": r.mobile_no,
            Course: r.course,
            Batch: r.batch || "—",
            "Year of Study": r.year_of_study,
            "Registration No": r.reg_no,
            "Office Name": r.name_of_office,
            Post: r.post,
            "Joining Date": new Date(r.joining_date).toLocaleDateString(
              "en-IN"
            ),
            "Office Address": r.office_address || "—",
            "Request Status": REQUEST_STATUS_MAP[String(r.request_status)],
            Status: r.status == 1 ? "Active" : "Inactive",
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

          { name: "course", label: "Course", type: "text", required: true },
          { name: "batch", label: "Batch", type: "text" },

          {
            name: "year_of_study",
            label: "Year of Study",
            type: "select",
            options: Array.from(
              { length: new Date().getFullYear() - 1999 },
              (_, i) => {
                const y = 2000 + i;
                return { label: String(y), value: String(y) };
              }
            ),
            required: true,
          },

          {
            name: "reg_no",
            label: "Registration No",
            type: "text",
            required: true,
          },
          {
            name: "name_of_office",
            label: "Office Name",
            type: "select",
            options: officeOptions,
            required: true,
          },
          { name: "post", label: "Post", type: "text", required: true },
          {
            name: "joining_date",
            label: "Joining Date",
            type: "date",
            required: true,
          },
          {
            name: "office_address",
            label: "Office Address",
            type: "textarea",
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
