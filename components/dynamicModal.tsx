"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/api/apiClients";
import { useToast } from "@/contexts/ToastContext";

type FieldType =
  | "text"
  | "email"
  | "password"
  | "select"
  | "textarea"
  | "file"
  | "date"
  | string;

interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (val: string) => void;
}

interface DynamicFormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  endpoint?: string;
  method?: "POST" | "PUT";
  editId?: number | string;
  defaultValues?: Record<string, any> | null;
  onSuccess?: () => void;
  onSubmit?: (formData: FormData) => Promise<any>;
}

export default function DynamicFormModal({
  title,
  isOpen,
  onClose,
  fields,
  endpoint,
  method = "POST",
  editId,
  defaultValues = {},
  onSuccess,
  onSubmit,
}: DynamicFormModalProps) {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const normalized: Record<string, any> = {};
    if (defaultValues) {
      for (const [k, v] of Object.entries(defaultValues)) {
        if (typeof v === "number") normalized[k] = String(v);
        else normalized[k] = v;
      }
    }
    setFormState(normalized);
    setError("");
  }, [defaultValues, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target as HTMLInputElement;

    if (type === "file") {
      const input = e.target as HTMLInputElement;
      const file =
        input.files && input.files.length > 0
          ? input.multiple
            ? Array.from(input.files)
            : input.files[0]
          : null;
      setFormState((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
      const field = fields.find((f) => f.name === name);
      if (field?.onChange) field.onChange(value);
    }
  };

  const removeFile = (fieldName: string) => {
    setFormState((prev) => ({ ...prev, [fieldName]: null }));
  };

  const buildFormData = () => {
    const fd = new FormData();
    for (const field of fields) {
      const val = formState[field.name];
      if (val === undefined || val === null) continue;

      if (field.type === "file") {
        if (val instanceof File) {
          fd.append(field.name, val);
        } else if (Array.isArray(val)) {
          val.forEach((f) => {
            if (f instanceof File) fd.append(field.name, f);
          });
        }
      } else {
        fd.append(
          field.name,
          typeof val === "object" ? JSON.stringify(val) : String(val)
        );
      }
    }
    return fd;
  };

  const defaultSubmit = async (formData: FormData) => {
    if (!endpoint) throw new Error("No endpoint provided for default submit");
    const url = editId ? `${endpoint}/${editId}` : endpoint;
    return apiRequest(url, method, formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = buildFormData();
      if (onSubmit) await onSubmit(fd);
      else await defaultSubmit(fd);
      onSuccess?.();
      showSuccess("Submit successfully");
      onClose();
    } catch (err: any) {
      const msg =
        err?.message || (typeof err === "string" ? err : "An error occurred");
      setError(msg);
      showError(msg);
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ---------------------------
   * INLINE STYLES FOR SCROLL AREA
   * -------------------------- */
  const modalInnerStyle: React.CSSProperties = {
    maxHeight: "80vh",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#a3a3a3 #f1f1f1",
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-4"
      style={{ overflowY: "auto" }}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-0 relative"
        style={{ borderRadius: "1rem", overflow: "hidden" }}
      >
        {/* Scrollable inner content */}
        <div style={modalInnerStyle} className="p-6">
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold text-cyan-700 mb-4">{title}</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => {
              const value = formState?.[field.name] ?? "";

              if (field.type === "textarea") {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <textarea
                      name={field.name}
                      value={
                        typeof value === "string" ? value : JSON.stringify(value)
                      }
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={field.disabled}
                      className="w-full border rounded p-2 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <select
                      name={field.name}
                      value={value ?? ""}
                      onChange={handleChange}
                      required={field.required}
                      disabled={field.disabled}
                      className={`w-full border rounded p-2 focus:ring-2 focus:ring-cyan-500 ${
                        field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === "file") {
                const fileVal = formState[field.name];
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleChange}
                      multiple={field.multiple}
                      required={field.required && !defaultValues?.[field.name]}
                      disabled={field.disabled}
                      className="w-full"
                    />
                    {fileVal && (
                      <div className="flex items-center mt-2 space-x-2">
                        {fileVal instanceof File ? (
                          fileVal.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(fileVal)}
                              className="w-20 h-20 object-cover rounded"
                              alt="preview"
                            />
                          ) : (
                            <div className="border px-2 py-1 rounded text-sm">
                              {fileVal.name}
                            </div>
                          )
                        ) : typeof fileVal === "string" ? (
                          fileVal.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img
                              src={fileVal}
                              className="w-20 h-20 object-cover rounded"
                              alt="preview"
                            />
                          ) : (
                            <div className="border px-2 py-1 rounded text-sm">
                              {fileVal.split("/").pop()}
                            </div>
                          )
                        ) : null}

                        <button
                          type="button"
                          onClick={() => removeFile(field.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type === "date" ? "date" : field.type}
                    name={field.name}
                    value={
                      field.type === "date" && value
                        ? new Date(value).toISOString().split("T")[0]
                        : typeof value === "string"
                        ? value
                        : value ?? ""
                    }
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={field.disabled}
                    className={`w-full border rounded p-2 focus:ring-2 focus:ring-cyan-500 ${
                      field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-cyan-700 text-white py-2 mt-5 rounded-md hover:bg-cyan-800 transition"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* Inline CSS scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-thumb {
          background-color: #a3a3a3;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background-color: #7e7e7e;
        }
        div::-webkit-scrollbar-track {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
}
