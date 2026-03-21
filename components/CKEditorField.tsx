"use client";

import { useRef, useEffect, useState } from "react";
import CKEditorUploadAdapter from "./CKEditorUploadAdapter";

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
  const [isMounted, setIsMounted] = useState(false);
  const [Editor, setEditor] = useState<{
    CKEditor: any;
    ClassicEditor: any;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Load CKEditor only on client side
    const loadEditor = async () => {
      try {
        const [ckeditorModule, classicEditorModule] = await Promise.all([
          import("@ckeditor/ckeditor5-react"),
          import("@ckeditor/ckeditor5-build-classic"),
        ]);

        setEditor({
          CKEditor: ckeditorModule.CKEditor,
          ClassicEditor: classicEditorModule.default,
        });
      } catch (error) {
        console.error("Failed to load CKEditor:", error);
      }
    };

    loadEditor();
  }, []);

  const trackUploadedImage = (imageUrl: string) => {
    if (!uploadedImagesRef.current.includes(imageUrl)) {
      uploadedImagesRef.current.push(imageUrl);
      console.log("📸 Image uploaded and tracked:", imageUrl);
      console.log("📚 All tracked images:", uploadedImagesRef.current);
      onImagesUploaded?.(uploadedImagesRef.current);
    }
  };

  // Don't render anything on server or while loading
  if (!isMounted || !Editor) {
    return (
      <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading editor...</div>
      </div>
    );
  }

  const { CKEditor, ClassicEditor } = Editor;

  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          extraPlugins: [
            function (editor: any) {
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
        onChange={(_ : any, editor : any) => {
          const data = editor.getData();
          onChange(data);
          onImagesUploaded?.(uploadedImagesRef.current);
        }}
        onReady={(editor : any) => {
          editorRef.current = editor;
          console.log("✅ CKEditor is ready!");
        }}
        onError={(error : any, { willEditorRestart } : any) => {
          console.error("❌ CKEditor error:", error);
          if (willEditorRestart) {
            console.log("🔄 Editor will restart");
          }
        }}
      />
    </div>
  );
}
