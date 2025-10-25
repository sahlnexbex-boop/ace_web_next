"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/api/apiClients";

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

  // normalize default values
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
    const { name, type } = e.target as HTMLInputElement;
    if (type === "file") {
      const input = e.target as HTMLInputElement;
      const file = input.files && input.files.length > 0 ? input.files[0] : null;
      setFormState((prev) => ({ ...prev, [name]: file }));
    } else {
      const value = (e.target as HTMLInputElement).value;
      setFormState((prev) => ({ ...prev, [name]: value }));
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
        }
      } else {
        fd.append(field.name, typeof val === "object" ? JSON.stringify(val) : String(val));
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
      onClose();
    } catch (err: any) {
      const msg = err?.message || (typeof err === "string" ? err : "An error occurred");
      setError(msg);
      console.error("submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-cyan-700 mb-4">{title}</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            const value = formState?.[field.name] ?? "";

            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={typeof value === "string" ? value : JSON.stringify(value)}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-cyan-500"
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={value ?? ""}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <>
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleChange}
                      required={field.required && !defaultValues?.[field.name]}
                      className="w-full"
                    />
                    {formState[field.name] && (
                      <div className="flex items-center mt-2 space-x-2">
                        {formState[field.name] instanceof File ? (
                          formState[field.name].type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(formState[field.name])}
                              className="w-20 h-20 object-cover rounded"
                              alt="preview"
                            />
                          ) : (
                            <div className="flex items-center border px-2 py-1 rounded space-x-2">
                              <span className="text-gray-700">{formState[field.name].name}</span>
                            </div>
                          )
                        ) : typeof formState[field.name] === "string" ? (
                          formState[field.name].endsWith(".png") ||
                          formState[field.name].endsWith(".jpg") ||
                          formState[field.name].endsWith(".jpeg") ? (
                            <img
                              src={formState[field.name]}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ) : (
                            <div className="flex items-center border px-2 py-1 rounded space-x-2">
                              <span className="text-gray-700">
                                {formState[field.name].split("/").pop()}
                              </span>
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
                  </>
                ) : (
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
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-cyan-500"
                  />
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
