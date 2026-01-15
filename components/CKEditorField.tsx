"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import CKEditorUploadAdapter from "./CKEditorUploadAdapter";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then(m => m.CKEditor),
  { ssr: false }
);

const ClassicEditor = dynamic(
  () => import("@ckeditor/ckeditor5-build-classic"),
  { ssr: false }
);

interface Props {
  value: string;
  onChange: (value: string) => void;
  onImagesUploaded?: (imageUrls: string[]) => void;
}

export default function CKEditorField({
  value,
  onChange,
  onImagesUploaded,
}: Props) {
  const uploadedImagesRef = useRef<string[]>([]);

  const trackUploadedImage = (url: string) => {
    if (!uploadedImagesRef.current.includes(url)) {
      uploadedImagesRef.current.push(url);
      onImagesUploaded?.(uploadedImagesRef.current);
    }
  };

  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor as any}
        data={value || ""}
        config={{
          extraPlugins: [
            (editor: any) => {
              editor.plugins.get("FileRepository").createUploadAdapter = (
                loader: any
              ) => {
                const adapter = new CKEditorUploadAdapter(loader);
                const originalUpload = adapter.upload.bind(adapter);

                adapter.upload = async () => {
                  const result = await originalUpload();
                  trackUploadedImage(result.default);
                  return result;
                };

                return adapter;
              };
            },
          ],
        }}
        onChange={(_, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
