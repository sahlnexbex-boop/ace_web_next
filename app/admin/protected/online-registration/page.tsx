"use client";

import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";

import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";

import {
  getOnlineRegistrations,
  getOnlineRegistrationById,
  createOnlineRegistration,
  updateOnlineRegistration,
  deleteOnlineRegistration,
} from "@/lib/api/registration";

import { getCourseCategories } from "@/lib/api/courseCategory";
import { getCourses } from "@/lib/api/course";

export default function OnlineRegistrationPage() {
  const [data, setData] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selected, setSelected] = useState<any>(null);

  // 🔑 controls course select enable/disable
  const [courseDisabled, setCourseDisabled] = useState(true);

  const [viewData, setViewData] = useState<any>(null);
  const debouncedSearch = useDebounce(search, 500);

  /* ---------- STATIC OPTIONS ---------- */

  const BRANCH_OPTIONS = [
    "AREACODE",
    "BALUSSERY",
    "CALICUT",
    "EDAPPAL",
    "MALAPPURAM",
    "MANJERI",
    "NILAMBUR",
    "PALAKKAD",
    "PATTAMBI",
    "PERINTHALMANNA",
    "TIRUR",
  ].map((v) => ({ label: v, value: v }));

  const DISTRICT_OPTIONS = [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ].map((v) => ({ label: v, value: v }));

  const RELIGION_OPTIONS = [
    "Hindu",
    "Islam",
    "Sikh",
    "Christian",
    "Buddhist",
    "Jain",
    "Parsi",
    "Other",
  ].map((v) => ({ label: v, value: v }));

  const COMMUNITY_OPTIONS = [
    "GEN",
    "Ezhava",
    "SC",
    "ST",
    "Muslim",
    "LC/AL",
    "OBC",
    "Vishwakarma",
    "Nadar",
    "OX",
    "Dheevara",
    "Other",
  ].map((v) => ({ label: v, value: v }));

  const QUALIFICATION_OPTIONS = [
    "Phd",
    "MPhil",
    "PG",
    "B.Ed",
    "Degree",
    "Diploma",
    "TTC",
    "ITI/ITC",
    "+2",
    "SSLC",
    "Others",
  ].map((v) => ({ label: v, value: v }));

  /* ---------------- LOAD MASTER DATA ---------------- */

  const loadDepartments = async () => {
    const res = await getCourseCategories(1, 200, "");
    setDepartments(res?.data || []);
  };

  const loadCourses = async (departmentId: string) => {
    if (!departmentId) {
      setCourses([]);
      setCourseDisabled(true);
      return;
    }

    const res = await getCourses(1, 200, "", {
      category_id: departmentId,
    });

    setCourses(res?.data || []);
    setCourseDisabled(false);
  };

  /* ---------------- LOAD REGISTRATIONS ---------------- */

  const loadData = async () => {
    const department_id =
      filters.department_id && filters.department_id !== ""
        ? Number(filters.department_id)
        : undefined;

    const course_id =
      filters.course_id && filters.course_id !== ""
        ? Number(filters.course_id)
        : undefined;

    const apply_status =
      filters.apply_status && filters.apply_status !== ""
        ? filters.apply_status
        : undefined;

    const res = await getOnlineRegistrations(
      page,
      10,
      debouncedSearch,
      department_id,
      course_id,
      apply_status
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

  /* ---------------- OPTIONS ---------------- */

  const departmentOptions = departments.map((d) => ({
    label: d.category_name,
    value: String(d.category_id),
  }));

  const courseOptions = courses.map((c) => ({
    label: c.course_name,
    value: String(c.course_id),
  }));

  /* ---------------- HELPER: Parse Qualification ---------------- */
  const parseQualification = (qual: any): string[] => {
    if (Array.isArray(qual)) {
      return qual;
    }

    if (typeof qual === "string") {
      try {
        const parsed = JSON.parse(qual);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Online Registrations
        </h1>

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
                key: "course_id",
                label: "Course",
                type: "select",
                options: courseOptions,
              },
              {
                key: "apply_status",
                label: "Status",
                type: "select",
                options: [
                  { label: "Requested", value: "requested" },
                  { label: "Ongoing", value: "ongoing" },
                  { label: "Completed", value: "closed-success" },
                  { label: "Rejected", value: "closed-rejected" },
                ],
              },
            ]}
            onChange={(f) => {
              setFilters(f);
              setPage(1);

              // 🔁 Reload course list when department filter changes
              if (f.department_id) loadCourses(f.department_id);
              else {
                setCourses([]);
                setCourseDisabled(true);
              }
            }}
          />

          <button
            onClick={() => {
              setSelected(null);
              setCourses([]);
              setCourseDisabled(true);
              setOpenForm(true);
            }}
            className="bg-cyan-700 cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-md"
          >
            Add Registration <IconPlus size={18} />
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
          { key: "student_name", label: "Student Name" },
          { key: "branch", label: "Branch" },
          {
            key: "department",
            label: "Department",
            render: (r) => r.department?.category_name || "—",
          },
          {
            key: "course",
            label: "Course",
            render: (r) => r.course?.course_name || "—",
          },
          { key: "phone_number", label: "Mobile" },
          {
            key: "apply_status",
            label: "Status",
            render: (r) => {
              const map: Record<string, string> = {
                requested: "bg-orange-100 text-orange-700",
                ongoing: "bg-yellow-100 text-yellow-700",
                "closed-success": "bg-green-100 text-green-700",
                "closed-rejected": "bg-red-100 text-red-700",
              };

              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    map[r.apply_status] || "bg-gray-100"
                  }`}
                >
                  {r.apply_status?.replace("-", " ")}
                </span>
              );
            },
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
            course_id: String(row.course_id),
            //  Parse qualification properly
            qualification: parseQualification(row.qualification),
            date_of_birth: row.date_of_birth?.split("T")[0],
          });

          loadCourses(String(row.department_id));
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const r = await getOnlineRegistrationById(row.registration_id);

          setViewData({
            Branch: r.branch,
            "Student Name": r.student_name,
            "Father Name": r.father_name,
            "Date of Birth": r.date_of_birth,
            Gender: r.gender,
            "Marital Status": r.marital_status,
            Religion: r.religion,
            Community: r.community,
            Qualification:
              parseQualification(r.qualification).join(", ") || "—",
            "House Name": r.house_name,
            Place: r.place,
            District: r.district,
            "Pin Code": r.pin_code,
            Email: r.email,
            "Phone Number": r.phone_number,
            "Second Phone": r.second_phone_no,
            Message: r.message || "—",
            Department: r.department?.category_name || "—",
            Course: r.course?.course_name || "—",
            Status: r.apply_status,
            Photo: r.student_photo ? (
              <img
                src={r.student_photo}
                className="w-16 h-16 rounded object-cover"
              />
            ) : (
              "—"
            ),
          });

          setOpenView(true);
        }}
      />

      {/* ---------------- FORM MODAL ---------------- */}
      <DynamicFormModal
        title={selected ? "Edit Registration" : "Create Registration"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          {
            name: "branch",
            label: "Branch",
            type: "select",
            options: BRANCH_OPTIONS,
            required: true,
          },

          {
            name: "department_id",
            label: "Department",
            type: "select",
            options: departmentOptions,
            required: true,
            onChange: (v) => loadCourses(v),
          },

          {
            name: "course_id",
            label: "Course",
            type: "select",
            options: courseOptions,
            required: true,
            disabled: courseDisabled,
          },

          {
            name: "student_name",
            label: "Student Name",
            type: "text",
            required: true,
          },
          {
            name: "father_name",
            label: "Father Name",
            type: "text",
            required: true,
          },
          {
            name: "date_of_birth",
            label: "Date of Birth",
            type: "date",
            required: true,
          },

          {
            name: "gender",
            label: "Gender",
            type: "select",
            options: [
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Others", value: "Others" },
            ],
            required: true,
          },

          {
            name: "marital_status",
            label: "Marital Status",
            type: "select",
            options: [
              { label: "Single", value: "Single" },
              { label: "Married", value: "Married" },
            ],
            required: true,
          },

          {
            name: "religion",
            label: "Religion",
            type: "select",
            options: RELIGION_OPTIONS,
          },

          {
            name: "community",
            label: "Community",
            type: "select",
            options: COMMUNITY_OPTIONS,
          },

          {
            name: "qualification",
            label: "Qualification",
            type: "select",
            multiple: true,
            options: QUALIFICATION_OPTIONS,
          },

          { name: "house_name", label: "House Name", type: "text" },
          { name: "place", label: "Place", type: "text" },

          {
            name: "district",
            label: "District",
            type: "select",
            options: DISTRICT_OPTIONS,
          },

          { name: "pin_code", label: "Pin Code", type: "text" },
          { name: "email", label: "Email", type: "email", required: true },
          {
            name: "phone_number",
            label: "Phone Number",
            type: "text",
            required: true,
          },
          {
            name: "second_phone_no",
            label: "Second Phone Number",
            type: "text",
          },

          {
            name: "apply_status",
            label: "Apply Status",
            type: "select",
            options: [
              { label: "Requested", value: "requested" },
              { label: "Ongoing", value: "ongoing" },
              { label: "Completed", value: "closed-success" },
              { label: "Rejected", value: "closed-rejected" },
            ],
          },

          { name: "message", label: "Message", type: "textarea" },
          { name: "student_photo", label: "Student Photo", type: "file" },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          // The qualification is already properly formatted by the modal
          // No need to process it here anymore

          if (selected) {
            await updateOnlineRegistration(selected.registration_id, fd);
          } else {
            await createOnlineRegistration(fd);
          }
        }}
        onSuccess={() => {
          setOpenForm(false);
          loadData();
        }}
      />

      {/* ---------------- DELETE MODAL ---------------- */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteOnlineRegistration(selected.registration_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Registration"
        message={`Are you sure you want to delete ${selected?.student_name}?`}
      />

      {/* ---------------- VIEW MODAL ---------------- */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Registration Details"
        data={viewData}
      />
    </div>
  );
}
