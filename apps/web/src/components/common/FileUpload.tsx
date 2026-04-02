import { useCallback, useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  file: File;
  preview?: string;
}

export interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  label?: string;
  hint?: string;
  className?: string;
  onChange?: (files: File[]) => void;
}

export function FileUpload({
  accept = ".jpg,.jpeg,.png,.pdf",
  maxSizeMB = 10,
  multiple = true,
  label = "Choose a file or drag and drop it here",
  hint = "jpeg, png, pdf format, upto 10MB",
  className,
  onChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const valid = Array.from(incoming).filter((f) => f.size <= maxBytes);
      setFiles((prev) => {
        const next = [...prev, ...valid];
        onChange?.(next);
        return next;
      });
    },
    [maxBytes, onChange],
  );

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const next = prev.filter((_, i) => i !== index);
        onChange?.(next);
        return next;
      });
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? "border-teal-600 bg-teal-50/30"
            : "border-neutral-300 bg-slate-50/50 hover:border-teal-500/50 hover:bg-slate-50"
        }`}
      >
        <div
          className={`flex items-center justify-center p-3 rounded-full mb-3 ${
            isDragging ? "bg-teal-600" : "bg-teal-50"
          }`}
        >
          <Upload
            className={`w-6 h-6 ${isDragging ? "text-white" : "text-teal-600"}`}
          />
        </div>
        <p className="text-sm  text-neutral-800">
          {isDragging ? "Drop your files here" : label}
        </p>
        <p className="text-xs text-neutral-500 mt-1">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          accept={accept}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            Uploaded Files ({files.length})
          </p>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-sm text-slate-700 truncate">
                  {file.name}
                </span>
                <span className="text-xs text-slate-400 shrink-0">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
