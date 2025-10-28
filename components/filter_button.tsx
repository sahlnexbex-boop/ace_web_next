"use client";

import { useEffect, useRef, useState } from "react";
import { IconFilter } from "@tabler/icons-react";

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterField {
  key: string;
  label: string;
  type?: "select" | "date";
  options?: FilterOption[];
  // ✅ Optional conditional visibility (based on another field)
  showIf?: {
    field: string;
    value: string | number;
  };
}

interface TableFilterProps {
  fields: FilterField[];
  onChange: (filters: Record<string, string>) => void;
}

export default function TableFilter({ fields, onChange }: TableFilterProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const filterRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Trigger change on filter update
  useEffect(() => {
    onChange(filters);
  }, [filters]);

  // ✅ Helper to check visibility of conditional filters
  const shouldShowField = (field: FilterField) => {
    if (!field.showIf) return true;
    const targetValue = filters[field.showIf.field];
    return targetValue === String(field.showIf.value);
  };

  return (
    <div className="relative" ref={filterRef}>
      {/* Filter Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 border px-3 py-2 rounded-md shadow-sm transition"
      >
        <IconFilter size={18} />
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3 z-50">
          <div className="flex flex-col gap-3">
            {fields
              .filter((field) => shouldShowField(field))
              .map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-gray-600 font-medium">
                    {field.label}
                  </label>

                  {/* Date Input */}
                  {field.type === "date" ? (
                    <input
                      type="date"
                      value={filters[field.key] ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full border rounded-md p-2 text-sm"
                    />
                  ) : (
                    /* Select Input */
                    <select
                      value={filters[field.key] ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full border rounded-md p-2 text-sm"
                    >
                      <option value="">All</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
