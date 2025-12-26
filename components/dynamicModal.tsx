"use client";
import React, { useEffect, useState, useCallback } from "react";
import { X, RotateCw, Check, ZoomIn, ZoomOut, Edit2 } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

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

interface CropState {
  image: string;
  fieldName: string;
  originalFile: File;
  fileIndex?: number;
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
  const [cropState, setCropState] = useState<CropState | null>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    if (!isOpen) return;

    const normalized: Record<string, any> = {};
    if (defaultValues) {
      for (const [k, v] of Object.entries(defaultValues)) {
        const field = fields.find((f) => f.name === k);

        if (field?.multiple && field?.type === "select") {
          if (Array.isArray(v)) {
            normalized[k] = v;
          } else if (typeof v === "string") {
            try {
              const parsed = JSON.parse(v);
              normalized[k] = Array.isArray(parsed) ? parsed : [];
            } catch {
              normalized[k] = [];
            }
          } else {
            normalized[k] = [];
          }
        } else if (Array.isArray(v)) {
          normalized[k] = v;
        } else if (typeof v === "number") {
          normalized[k] = String(v);
        } else {
          normalized[k] = v;
        }
      }
    }
    setFormState(normalized);
    setError("");
  }, [isOpen]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target as HTMLInputElement;

    if (type === "file") {
      const input = e.target as HTMLInputElement;
      const files = input.files;

      if (files && files.length > 0) {
        const field = fields.find((f) => f.name === name);

        if (field?.multiple) {
          // Handle multiple files - convert FileList to Array
          const filesArray = Array.from(files);
          setFormState((prev) => ({ ...prev, [name]: filesArray }));
        } else {
          // Handle single file
          setFormState((prev) => ({ ...prev, [name]: files[0] }));
        }
      }
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
      const field = fields.find((f) => f.name === name);
      if (field?.onChange) field.onChange(value);
    }
  };

  const handleMultiSelectChange = (name: string, selectedOptions: any) => {
    const values = selectedOptions
      ? selectedOptions.map((opt: any) => opt.value)
      : [];
    setFormState((prev) => ({ ...prev, [name]: values }));

    const field = fields.find((f) => f.name === name);
    if (field?.onChange) field.onChange(values.join(","));
  };

  const openCropModal = (fieldName: string, fileIndex?: number) => {
    const fileVal = formState[fieldName];
    let file: File | null = null;

    if (fileVal instanceof File) {
      file = fileVal;
    } else if (Array.isArray(fileVal) && fileIndex !== undefined) {
      file = fileVal[fileIndex];
    }

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCropState({
          image: ev.target?.result as string,
          fieldName: fieldName,
          originalFile: file!,
          fileIndex: fileIndex,
        });
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setAspect(1);
        setCroppedAreaPixels(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fieldName: string, fileIndex?: number) => {
    setFormState((prev) => {
      const fileVal = prev[fieldName];

      if (Array.isArray(fileVal) && fileIndex !== undefined) {
        // Remove specific file from array
        const newFiles = fileVal.filter((_, i) => i !== fileIndex);
        return { ...prev, [fieldName]: newFiles.length > 0 ? newFiles : null };
      } else {
        // Remove single file
        return { ...prev, [fieldName]: null };
      }
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180;
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    };
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const rotRad = getRadianAngle(rotation);

    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropImage = async () => {
    if (!cropState || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(
        cropState.image,
        croppedAreaPixels,
        rotation
      );

      if (croppedBlob) {
        const file = new File([croppedBlob], cropState.originalFile.name, {
          type: cropState.originalFile.type,
        });

        setFormState((prev) => {
          const fileVal = prev[cropState.fieldName];

          if (Array.isArray(fileVal) && cropState.fileIndex !== undefined) {
            // Replace specific file in array
            const newFiles = [...fileVal];
            newFiles[cropState.fileIndex] = file;
            return { ...prev, [cropState.fieldName]: newFiles };
          } else {
            // Replace single file
            return { ...prev, [cropState.fieldName]: file };
          }
        });

        setCropState(null);
      }
    } catch (e) {
      console.error("Error cropping image:", e);
    }
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
          // Append each file separately with the same field name
          val.forEach((f) => {
            if (f instanceof File) {
              fd.append(field.name, f);
            }
          });
        }
      } else if (field.multiple && Array.isArray(val)) {
        fd.append(field.name, JSON.stringify(val));
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
    console.log("Submitting to:", url, method);
    return Promise.resolve({ success: true });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const fd = buildFormData();

      if (onSubmit) await onSubmit(fd);
      else await defaultSubmit(fd);

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg =
        err?.message || (typeof err === "string" ? err : "An error occurred");

      setError(msg);
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const modalInnerStyle: React.CSSProperties = {
    maxHeight: "80vh",
    overflowY: "auto",
  };

  // Render file preview
  const renderFilePreview = (field: Field) => {
    const fileVal = formState[field.name];
    if (!fileVal) return null;

    // Handle multiple files
    if (Array.isArray(fileVal)) {
      return (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {fileVal.map((item, index) => {
            //  EXISTING IMAGE (string)
            if (typeof item === "string") {
              return (
                <div key={index} className="relative group">
                  <img
                    src={`${server_url}${item}`}
                    className="w-full h-24 object-cover rounded border"
                    alt={`existing-${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(field.name, index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            }

            //  NEW FILE IMAGE
            if (item instanceof File && item.type.startsWith("image/")) {
              return (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(item)}
                    className="w-full h-24 object-cover rounded border"
                    alt={`new-${index}`}
                  />
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => openCropModal(field.name, index)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white p-1 rounded-full cursor-pointer"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(field.name, index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      );
    }

    // Handle single file
    if (fileVal instanceof File) {
      if (fileVal.type.startsWith("image/")) {
        return (
          <div className="relative group mt-2 inline-block">
            <img
              src={URL.createObjectURL(fileVal)}
              className="w-32 h-32 object-cover rounded border"
              alt="preview"
            />
            <div className="absolute top-1 right-1 flex gap-1">
              <button
                type="button"
                onClick={() => openCropModal(field.name)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white p-1.5 rounded-full shadow-lg transition cursor-pointer"
                title="Edit image"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeFile(field.name)}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition cursor-pointer"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 border px-3 py-2 rounded mt-2">
            <span className="text-sm">{fileVal.name}</span>
            <button
              type="button"
              onClick={() => removeFile(field.name)}
              className="text-red-500 hover:text-red-700 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        );
      }
    }

    // Handle existing files (string URLs)
    if (typeof fileVal === "string") {
      if (fileVal.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return (
          <div className="relative group mt-2 inline-block">
            <img
              src={`${server_url}${fileVal}`}
              className="w-32 h-32 object-cover rounded border"
              alt="preview"
            />
            <div className="absolute top-1 right-1">
              <button
                type="button"
                onClick={() => removeFile(field.name)}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition cursor-pointer"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 border px-3 py-2 rounded mt-2">
            <span className="text-sm">{fileVal.split("/").pop()}</span>
            <button
              type="button"
              onClick={() => removeFile(field.name)}
              className="text-red-500 hover:text-red-700 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        );
      }
    }

    return null;
  };

  if (cropState) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex justify-center items-center z-50">
        <div
          className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-4 flex flex-col"
          style={{ height: "90vh" }}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-cyan-700">
              Crop & Rotate Image
            </h2>
            <button
              onClick={() => setCropState(null)}
              className="text-gray-500 hover:text-black cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 relative bg-gray-900">
              {/* Cropper would go here - removed due to external dependency */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <img
                  src={cropState.image}
                  alt="Crop preview"
                  className="max-w-full max-h-full"
                />
              </div>
            </div>

            <div className="w-full md:w-80 p-6 space-y-4 overflow-y-auto bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Free", value: 0 },
                    { label: "1:1", value: 1 },
                    { label: "16:9", value: 16 / 9 },
                    { label: "4:3", value: 4 / 3 },
                    { label: "3:4", value: 3 / 4 },
                    { label: "9:16", value: 9 / 16 },
                  ].map((ratio) => (
                    <button
                      key={ratio.label}
                      type="button"
                      onClick={() => setAspect(ratio.value)}
                      className={`px-3 py-2 cursor-pointer rounded text-sm font-medium transition ${
                        aspect === ratio.value
                          ? "bg-cyan-600 text-white"
                          : "bg-white text-gray-700 border hover:bg-gray-50"
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center justify-between">
                    <span>Zoom</span>
                    <span className="text-xs text-gray-500">
                      {zoom.toFixed(1)}x
                    </span>
                  </div>
                </label>
                <div className="flex items-center gap-2">
                  <ZoomOut size={16} className="text-gray-500" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 cursor-pointer"
                  />
                  <ZoomIn size={16} className="text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center justify-between">
                    <span>Rotation</span>
                    <span className="text-xs text-gray-500">{rotation}°</span>
                  </div>
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full mb-2 cursor-pointer"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRotation((prev) => (prev - 90 + 360) % 360)
                    }
                    className="flex-1 cursor-pointer flex items-center justify-center gap-1 px-3 py-2 bg-white border rounded text-sm hover:bg-gray-50 transition"
                  >
                    <RotateCw size={14} className="transform -scale-x-100" />
                    -90°
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-1 px-3 py-2 bg-white border rounded text-sm hover:bg-gray-50 transition"
                  >
                    <RotateCw size={14} />
                    +90°
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-2 border-t">
                <button
                  type="button"
                  onClick={handleCropImage}
                  className="w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition"
                >
                  <Check size={18} />
                  Apply Crop
                </button>
                <button
                  type="button"
                  onClick={() => setCropState(null)}
                  className="w-full px-4 cursor-pointer py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-4"
      style={{ overflowY: "auto" }}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-0 relative"
        style={{ borderRadius: "1rem", overflow: "hidden" }}
      >
        <div style={modalInnerStyle} className="p-6">
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold text-cyan-700 mb-4">{title}</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="space-y-4">
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
                        typeof value === "string"
                          ? value
                          : JSON.stringify(value)
                      }
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={field.disabled}
                      className="w-full border rounded p-2 focus:ring-2 focus:ring-cyan-500"
                      rows={4}
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
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleChange}
                      accept={field.placeholder || undefined}
                      required={field.required && !defaultValues?.[field.name]}
                      disabled={field.disabled}
                      multiple={field.multiple || false}
                      className="w-full"
                    />
                    {renderFilePreview(field)}
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
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full cursor-pointer bg-cyan-700 text-white py-2 mt-5 rounded-md hover:bg-cyan-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
