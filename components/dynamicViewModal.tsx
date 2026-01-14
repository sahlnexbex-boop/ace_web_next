"use client";

import React from "react";

interface DynamicViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, React.ReactNode> | null;
}

export default function DynamicViewModal({
  isOpen,
  onClose,
  title,
  data,
}: DynamicViewModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-5 text-cyan-700">{title}</h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto overflow-x-hidden px-1">
          {Object.entries(data).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-wrap gap-3 justify-between items-start border-b border-gray-100 pb-2 px-4"
            >
              <span className="font-medium text-gray-700 capitalize max-w-[40%]">
                {label.replace(/_/g, " ")}
              </span>
              <div className="text-gray-600 text-sm  text-right break-words">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
