"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import CKEditorUploadAdapter from "./CKEditorUploadAdapter";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onImagesUploaded?: (imageUrls: string[]) => void;
}

/**
 * Dynamically load ONLY the React wrapper
 * (ClassicEditor is NOT a React component)
 */
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((m) => m.CKEditor),
  { ssr: false }
);

export default function CKEditorField({
  value,
  onChange,
  onImagesUploaded,
}: Props) {
  const uploadedImagesRef = useRef<string[]>([]);
  const editorRef = useRef<any>(null);

  const trackUploadedImage = (imageUrl: string) => {
    if (!uploadedImagesRef.current.includes(imageUrl)) {
      uploadedImagesRef.current.push(imageUrl);
      onImagesUploaded?.([...uploadedImagesRef.current]);
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
                  if (result?.default) {
                    trackUploadedImage(result.default);
                  }
                  return result;
                };

                return adapter;
              };
            },
          ],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "undo",
            "redo",
          ],
        }}
        onChange={(_, editor) => {
          onChange(editor.getData());
          onImagesUploaded?.([...uploadedImagesRef.current]);
        }}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}
