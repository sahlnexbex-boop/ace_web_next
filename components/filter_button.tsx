"use client";

import { useEffect, useRef, useState } from "react";
import { IconFilter } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterField {
  key: string;
  label: string;
  type?: "select" | "date" | "year"; 
  options?: FilterOption[];
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

  //  Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (filterRef.current && !filterRef.current.contains(target)) {
        // Do not close if clicking inside Radix UI Select dropdown portals
        if (target.closest('[data-slot="select-content"]') || target.closest('[data-radix-popper-content-wrapper]')) {
          return;
        }
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Trigger change when filters update
  useEffect(() => {
    onChange(filters);
  }, [filters]);

  //  Conditional visibility
  const shouldShowField = (field: FilterField) => {
    if (!field.showIf) return true;
    const targetValue = filters[field.showIf.field];
    return targetValue === String(field.showIf.value);
  };

  //  Extract only the year from "YYYY-MM" value
  const extractYear = (monthValue: string) => monthValue?.split("-")[0] || "";

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

                  {/*  Normal Date Picker */}
                  {field.type === "date" && (
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
                  )}

                  {/*  Year-Only Picker */}
                  {field.type === "year" && (
                    <input
                      type="month"
                      value={
                        filters[field.key]
                          ? `${filters[field.key]}-01`
                          : ""
                      }
                      onChange={(e) => {
                        const year = extractYear(e.target.value);
                        setFilters((prev) => ({
                          ...prev,
                          [field.key]: year,
                        }));
                      }}
                      className="mt-1 w-full border rounded-md p-2 text-sm"
                      onFocus={(e) => e.target.showPicker?.()} // auto open picker if supported
                    />
                  )}

                  {/*  Select Dropdown */}
                  {(!field.type || field.type === "select") && (
                    <Select
                      value={filters[field.key] || "all"}
                      onValueChange={(val) =>
                        setFilters((prev) => ({
                          ...prev,
                          [field.key]: val === "all" ? "" : val,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-9 bg-white text-gray-700 font-normal focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="max-h-70 overflow-y-auto">
                        <SelectItem value="all">All</SelectItem>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
