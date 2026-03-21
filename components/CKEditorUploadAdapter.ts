export default class CKEditorUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      const data = new FormData();
      data.append("upload", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/upload-editor-image`,
        {
          method: "POST",
          body: data,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const result = await res.json();
      console.log("Upload result:", result);

      // CKEditor expects an object with a 'default' property containing the image URL
      return {
        default: result.url
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  abort() {
    // Optional: implement upload abort logic if needed
  }
}
