"use client";

import React from "react";

interface DynamicViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any> | null;
}

export default function DynamicViewModal({
  isOpen,
  onClose,
  title,
  data,
}: DynamicViewModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-cyan-700">{title}</h2>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto px-5">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between border-b border-gray-100 pb-2"
            >
              <span className="font-medium text-gray-700 capitalize">
                {key.replace(/_/g, " ")}
              </span>
              {typeof value === "string" && value.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                <img
                  src={value}
                  alt={key}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-600 max-w-[60%] text-left">
                  {String(value)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
