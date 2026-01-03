"use client";
import { X, RotateCw, Check, ZoomIn, ZoomOut } from "lucide-react";
import React, { useState, useCallback } from "react";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  image: string;
  open: boolean;
  onClose: () => void;
  onApply: (file: File) => void;
  fileName: string;
  mimeType: string;
}

export default function ImageCropModal({
  image,
  open,
  onClose,
  onApply,
  fileName,
  mimeType,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_: Area, pixels: Area) => setCroppedAreaPixels(pixels),
    []
  );

  const handleApply = async () => {
    if (!croppedAreaPixels) return;

    const img = new Image();
    img.src = image;
    await new Promise((r) => (img.onload = r));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], fileName, { type: mimeType });
      onApply(file);
      onClose();
    }, mimeType);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Crop Image</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* TEMP SIMPLE PREVIEW */}
        <div className="flex justify-center mb-4">
          <img src={image} className="max-h-[400px]" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => setRotation((r) => r + 90)}>
            <RotateCw />
          </button>
          <button onClick={handleApply} className="bg-cyan-600 text-white px-4 py-2 rounded">
            <Check /> Apply
          </button>
        </div>
      </div>
    </div>
  );
}
