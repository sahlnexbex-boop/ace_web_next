"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";

export default function ImageCropperModal({
  image,
  onCancel,
  onDone,
}: {
  image: string;
  onCancel: () => void;
  onDone: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState<any>(null);

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setArea(croppedAreaPixels);
  };

  const generateImage = async () => {
    const img = new Image();
    img.src = image;
    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = area.width;
    canvas.height = area.height;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      img,
      area.x,
      area.y,
      area.width,
      area.height,
      0,
      0,
      area.width,
      area.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      onDone(new File([blob], "cropped.png", { type: "image/png" }));
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-4">
        <div className="relative h-64 bg-black rounded">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-3 space-y-2">
          <label className="text-sm">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
          />

          <label className="text-sm">Rotate</label>
          <input
            type="range"
            min={0}
            max={360}
            value={rotation}
            onChange={(e) => setRotation(+e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={generateImage}
            className="px-4 py-2 bg-cyan-700 text-white rounded"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}
