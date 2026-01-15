"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditorUploadAdapter from "./CKEditorUploadAdapter";
import { useRef, useEffect } from "react";

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
  const editorRef = useRef<any>(null);

  // Track uploaded images
  const trackUploadedImage = (imageUrl: string) => {
    if (!uploadedImagesRef.current.includes(imageUrl)) {
      uploadedImagesRef.current.push(imageUrl);
      console.log(" Image uploaded and tracked:", imageUrl);
      console.log(" All tracked images:", uploadedImagesRef.current);
      // Notify parent component
      onImagesUploaded?.(uploadedImagesRef.current);
    }
  };

  // Extract image URLs from HTML content
  const extractImageUrls = (html: string): string[] => {
    if (!html) return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const images = doc.querySelectorAll("img");
      return Array.from(images).map((img) => img.src);
    } catch (error) {
      console.error("Error extracting images:", error);
      return [];
    }
  };

  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor as any}
        data={value || ""}
        config={{
          extraPlugins: [
            function (editor: any) {
              // Custom upload adapter
              editor.plugins.get("FileRepository").createUploadAdapter = (
                loader: any
              ) => {
                const adapter = new CKEditorUploadAdapter(loader);
                // Wrap the upload method to track uploaded images
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
          const data = editor.getData();
          onChange(data);

          // Update parent with current tracked images
          onImagesUploaded?.(uploadedImagesRef.current);
        }}
        onReady={(editor) => {
          editorRef.current = editor;
          console.log(" CKEditor is ready!");
        }}
        onError={(error, { willEditorRestart }) => {
          console.error(" CKEditor error:", error);
          if (willEditorRestart) {
            console.log(" Editor will restart");
          }
        }}
      />
    </div>
  );
}
