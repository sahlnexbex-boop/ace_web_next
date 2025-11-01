"use client";

import { X } from "lucide-react";
import { apiRequest } from "@/lib/api/apiClients";
import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  endpoint?: string; 
  id?: number | string;
  onConfirm?: () => Promise<void> | void; 
  onSuccess?: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  endpoint,
  id,
  onConfirm,
  onSuccess,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showInfo, showError } = useToast();

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      if (onConfirm) {
        await onConfirm();
      } else if (endpoint && id !== undefined) {
        await apiRequest(`${endpoint}/${id}`, "DELETE");
      } else {
        throw new Error("No delete handler or endpoint provided.");
      }

      onSuccess?.();
      showInfo("Deleted successfully");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      showError(err.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-cyan-700 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-1.5 cursor-pointer rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-1.5 cursor-pointer rounded bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
