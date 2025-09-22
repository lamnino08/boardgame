import { createImageUpload } from "novel";

const onUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('files', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const result = await response.json();
    if (result.urls && result.urls.length > 0) {
      return result.urls[0];
    }
  }

  return ""
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      // console.log("2");
      return false;
    }
    return true;
  },
});
