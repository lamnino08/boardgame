import React, { useState, DragEvent, ChangeEvent } from "react";
import { ImageIcon, PdfIcon, VideoIcon, FileIcon, TrashIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { BaseInput } from "@/components/FormBuilder/types";
import { uploadFiles } from "@/actions/upload/uploadAction"; // hàm upload đã có
import { EAlertType, useAlert } from "@/contexts/alert-context";
import { EUploadType } from "@/constant/upload/allowUploadType";

interface FileInputProps extends BaseInput<string[]> {
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  uploadType: EUploadType;
  id?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  multiple = false,
  accept,
  disabled = false,
  maxSizeMB = 5,
  uploadType,
  onChange,
  id,
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const showAlert = useAlert();

  const handleUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const fileArray = Array.from(selectedFiles);

    const tooLarge = fileArray.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (tooLarge) {
      setLocalError(`"${tooLarge.name}" vượt quá ${maxSizeMB}MB`);
      return;
    }

    setLocalError(null);
    setIsUploading(true);

    const formData = new FormData();
    fileArray.forEach((file) => formData.append("files", file));
    const res = await uploadFiles(formData, uploadType, id);
    if (res.meta.success && res.data) {
      const newUrls = multiple ? [...urls, ...res.data] : res.data;
      setUrls(newUrls);
      onChange?.(newUrls);
    } else {
      showAlert(res.meta.external_message, EAlertType.ERROR);
    }
    setIsUploading(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    handleUpload(e.dataTransfer.files);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files);
  };

  const handleRemove = (index: number) => {
    const updated = urls.filter((_, i) => i !== index);
    setUrls(updated);
    onChange?.(updated);
  };

  const getFileIcon = (url: string) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return ImageIcon;
    if (url.endsWith(".pdf")) return PdfIcon;
    if (url.match(/\.(mp4|mov|avi|mkv)$/i)) return VideoIcon;
    return FileIcon;
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && <label className={`form-label`}>{label}</label>}

      <div
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        className={`
          flex flex-col items-center justify-center w-full p-6 rounded-xl border-2 border-dashed border-border
          transition-all duration-200 cursor-pointer
          ${disabled ? "bg-disabled cursor-not-allowed" :
            dragActive ? "bg-disabled border-app-blue-light" :
              "bg-background hover:border-app-blue-DEFAULT"}
        `}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={disabled || isUploading}
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer text-center">
          <svg
            className="w-12 h-12 text-text-secondary mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4l-4-4h8l-4 4z"
            />
          </svg>
          <span className="text-text-primary text-sm">
            {isUploading
              ? "Đang upload..."
              : disabled
                ? "Upload locked"
                : "Click or drag-and-drop file to upload"}
          </span>
          <span className="text-neutral-500 text-xs mt-1">
            {accept ? `Supported: ${accept}` : "All file types"} (Max {maxSizeMB}MB)
          </span>
        </label>
      </div>

      {/* Danh sách file (theo URL) */}
      {urls.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm">
          {urls.map((url, idx) => (
            <li key={idx} className="flex items-center justify-between bg-card p-2 rounded-md border border-border">
              <div className="flex items-center space-x-2 text-text-secondary truncate">
                <div className="text-app-blue-light">{getFileIcon(url)}</div>
                <span className="truncate">{url}</span>
              </div>
              <button
                onClick={() => handleRemove(idx)}
                className="text-danger hover:scale-110 transition-transform duration-200"
              >
                {TrashIcon}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileInput;