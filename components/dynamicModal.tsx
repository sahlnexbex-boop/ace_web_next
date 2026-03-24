"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, RotateCw, Check, ZoomIn, ZoomOut, Edit2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Cropper from "react-easy-crop";
import CKEditorField from "@/components/CKEditorField";
import Select from "react-select";
import ModuleChapterEditor from "@/components/ModuleChapterEditor";

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
  const { showSuccess, showError } = useToast();
  const cropRef = React.useRef<Point>({ x: 0, y: 0 });
  const rafRef = React.useRef<number | null>(null);
  const allEditorImagesRef = useRef<string[]>([]);
  const [uploadedEditorImages, setUploadedEditorImages] = useState<string[]>(
    []
  );
  const initialContentRef = useRef<string>("");
  const ASPECT_RATIOS = [
    { label: "Free", value: 0 },
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:4", value: 3 / 4 },
    { label: "9:16", value: 9 / 16 },
  ];
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const extractImageUrls = (html: string): string[] => {
    if (!html) return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const images = doc.querySelectorAll("img");
      return Array.from(images).map((img) => img.src);
    } catch (error) {
      console.error("Error extracting image URLs:", error);
      return [];
    }
  };

  // ============= Track all images in editor =============
  const trackAllEditorImages = (content: string) => {
    const currentImages = extractImageUrls(content);

    // Add any new images to our tracking list
    currentImages.forEach((url) => {
      if (!allEditorImagesRef.current.includes(url)) {
        allEditorImagesRef.current.push(url);
        console.log("📸 Now tracking image:", url);
      }
    });

    console.log("📦 All tracked editor images:", allEditorImagesRef.current);
  };

  // REPLACE cleanupUnusedImages with this version that handles ALL scenarios correctly:
  const cleanupUnusedImages = async (isSubmitting: boolean = false) => {
    try {
      const currentImages = extractImageUrls(formState.blog_content || "");
      const initialImages = extractImageUrls(initialContentRef.current);

      console.log("🔍 Cleanup check:", {
        isSubmitting,
        allTrackedImages: allEditorImagesRef.current,
        currentImages,
        initialImages,
      });

      let imagesToDelete: string[] = [];

      if (isSubmitting) {
        // =================== SUBMIT SCENARIO ===================
        // Delete images that were in editor at some point but removed before submit
        imagesToDelete = allEditorImagesRef.current.filter(
          (url) => !currentImages.includes(url)
        );

        console.log("💾 Submit mode: Deleting images removed from editor");
      } else {
        // =================== CLOSE SCENARIO ===================
        // Three types of images to delete:

        // 1. Images from initial content that were removed
        const removedFromInitial = initialImages.filter(
          (url) => !currentImages.includes(url)
        );

        // 2. Images that were uploaded but then deleted from editor
        const deletedAfterUpload = allEditorImagesRef.current.filter(
          (url) => !currentImages.includes(url) && !initialImages.includes(url)
        );

        // 3. NEW: If this is a CREATE form (no initial content), delete ALL uploaded images
        //    Because closing without submit means user cancelled
        const isCreateForm = !initialImages || initialImages.length === 0;

        if (isCreateForm) {
          // Delete ALL tracked images (user is cancelling new blog creation)
          imagesToDelete = [...allEditorImagesRef.current];
          console.log(
            "🚪 Close mode (CREATE): Deleting all uploaded images - user cancelled"
          );
        } else {
          // Delete only removed and deleted images (user is cancelling edit)
          imagesToDelete = [
            ...new Set([...removedFromInitial, ...deletedAfterUpload]),
          ];
          console.log("🚪 Close mode (EDIT): Deleting removed/deleted images");
        }

        console.log("   Removed from initial:", removedFromInitial);
        console.log("   Deleted after upload:", deletedAfterUpload);
      }

      console.log("🗑️ Images to delete:", imagesToDelete);

      if (imagesToDelete.length > 0) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/cleanup-editor-images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ imageUrls: imagesToDelete }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("✅ Cleaned up images:", result);
        } else {
          console.error("❌ Cleanup failed:", response.statusText);
        }
      } else {
        console.log("✅ No images to clean up");
      }
    } catch (error) {
      console.error("❌ Error cleaning up images:", error);
    }
  };

  // ============= Handle modal close =============
  const handleClose = async () => {
    console.log("🚪 Closing modal without submitting");
    await cleanupUnusedImages(false);
    setUploadedEditorImages([]);
    allEditorImagesRef.current = [];
    initialContentRef.current = "";
    onClose();
  };

  useEffect(() => {
    if (isOpen && defaultValues?.blog_content) {
      initialContentRef.current = defaultValues.blog_content;
    }
  }, [isOpen, defaultValues]);

  useEffect(() => {
    if (!isOpen) return;

    const normalized: Record<string, any> = {};
    if (defaultValues) {
      for (const [k, v] of Object.entries(defaultValues)) {
        const field = fields.find((f) => f.name === k);

        // Normalize multi-select style fields (including react-select multi)
        if (
          field?.multiple &&
          (field?.type === "select" || field?.type === "multi-select")
        ) {
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

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCrop(cropRef.current); // sync once
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
      ? selectedOptions.map((opt: any) => Number(opt.value))
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

  const onCropChange = (c: Point) => {
    cropRef.current = c;

    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      setCrop(cropRef.current);
      rafRef.current = null;
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

  // ============= Handle submit =============
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      console.log("💾 Submitting form");

      // Clean up images removed from editor before submitting
      await cleanupUnusedImages(true);

      const fd = buildFormData();

      if (onSubmit) await onSubmit(fd);
      else await defaultSubmit(fd);

      // Reset tracking
      setUploadedEditorImages([]);
      allEditorImagesRef.current = [];
      initialContentRef.current = "";

      onSuccess?.();
      showSuccess("Submitted successfully!");
      onClose();
    } catch (err: any) {
      const msg =
        err?.message || (typeof err === "string" ? err : "An error occurred");
      setError(msg);
      console.error("Submit error:", err);
      showError(msg);
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
            onClick={handleClose}
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

              if (field.type === "richtext") {
                return (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    <CKEditorField
                      value={formState[field.name] ?? ""}
                      onChange={(val) => {
                        setFormState((prev) => ({
                          ...prev,
                          [field.name]: val,
                        }));
                        trackAllEditorImages(val);
                      }}
                      onImagesUploaded={(urls) => {
                        // Update the uploaded images state
                        setUploadedEditorImages((prev) => {
                          const newUrls = urls.filter(
                            (url) => !prev.includes(url)
                          );
                          return [...prev, ...newUrls];
                        });

                        // Track all images in the ref
                        urls.forEach((url) => {
                          if (!allEditorImagesRef.current.includes(url)) {
                            allEditorImagesRef.current.push(url);
                          }
                        });
                      }}
                    />
                  </div>
                );
              }
              if (field.type === "module-chapters") {
                return (
                  <div key={field.name} className="pt-4 border-t mt-4 border-gray-100">
                    <ModuleChapterEditor
                      value={formState[field.name]}
                      onChange={(newVal) =>
                        setFormState((prev) => ({
                          ...prev,
                          [field.name]: newVal,
                        }))
                      }
                    />
                  </div>
                );
              }

              // React-select multi-select field
              if (field.type === "multi-select") {
                const currentValue = Array.isArray(value) ? value : [];
                const selectedOptions =
                  field.options?.filter((opt) => {
                    const optVal =
                      typeof opt.value === "string"
                        ? Number(opt.value)
                        : opt.value;
                    return currentValue.includes(optVal);
                  }) || [];

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <Select
                      isMulti
                      options={field.options}
                      value={selectedOptions}
                      onChange={(selected) =>
                        handleMultiSelectChange(field.name, selected || [])
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder={field.placeholder || "Select..."}
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
              disabled={loading || !!cropState}
              className="w-full cursor-pointer bg-cyan-700 text-white py-2 rounded"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= IMAGE CROP MODAL ================= */}
      {cropState && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-cyan-700">
                Crop & Rotate Image
              </h3>
              <button
                onClick={() => setCropState(null)}
                className="cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-1">
              {/* Cropper */}
              <div className="relative flex-1 bg-black min-h-0 will-change-transform">
                <Cropper
                  image={cropState.image}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect || undefined}
                  onCropChange={onCropChange}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Controls */}
              <div className="w-80 flex-shrink-0 p-4 bg-gray-50 space-y-4 overflow-y-auto">
                {/* Aspect */}
                <div>
                  <p className="text-sm font-medium mb-2">Aspect Ratio</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => setAspect(r.value)}
                        className={`px-3 cursor-pointer py-2 rounded text-sm font-medium ${
                          aspect === r.value
                            ? "bg-cyan-600 text-white"
                            : "bg-white border"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom */}
                <div>
                  <p className="text-sm font-medium">Zoom</p>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(+e.target.value)}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <p className="text-sm font-medium">Rotation</p>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={rotation}
                    onChange={(e) => setRotation(+e.target.value)}
                    className="w-full cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleCropImage}
                  className="w-full cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded"
                >
                  Apply Crop
                </button>

                <button
                  onClick={() => setCropState(null)}
                  className="w-full cursor-pointer border py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* =================================================== */}
    </div>
  );
}
