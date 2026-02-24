"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useAction } from "convex/react";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: () => void;
}

export const UploadDialog = ({ open, onOpenChange, onFileUploaded }: Props) => {
  const addFile = useAction(api.private.files.addFile);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    category: "",
    filename: "",
  });

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFiles([file]);
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({
          ...prev,
          filename: file.name,
        }));
      }
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      const blob = uploadedFiles[0];

      if (!blob) return;

      const filename = uploadForm.filename || blob.name;

      await addFile({
        bytes: await blob.arrayBuffer(),
        filename,
        mimeType: blob.type || "text/plain",
        category: uploadForm.category,
      });

      onFileUploaded?.();
      handleCancel();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUploadedFiles([]);
    setUploadForm({
      category: "",
      filename: "",
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tải lên tài liệu</DialogTitle>

          <DialogDescription>
            Tải lên tài liệu vào khoa dữ liệu để AI có thể tìm kiếm và tham khảo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục</Label>
            <Input
              className="w-full"
              id="category"
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="VD: Hướng dẫn, Hỗ trợ, v.v."
              type="text"
              value={uploadForm.category}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename">
              Tên file{" "}
              <span className="text-muted-foreground text-xs">(tùy chọn)</span>
            </Label>
            <Input
              className="w-full"
              id="filename"
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  filename: e.target.value,
                }))
              }
              placeholder="Ghi đè tên file"
              type="text"
              value={uploadForm.filename}
            />
          </div>

          <Dropzone
            accept={{
              "application/pdf": [".pdf"],
              "text/csv": [".csv"],
              "text/plain": [".txt"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            }}
            disabled={isUploading}
            maxFiles={1}
            src={uploadedFiles}
            onDrop={handleFileDrop}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>

        <DialogFooter>
          <Button
            variant={"outline"}
            disabled={isUploading}
            onClick={handleCancel}
          >
            Hủy
          </Button>

          <Button
            disabled={
              uploadedFiles.length === 0 || isUploading || !uploadForm.category
            }
            onClick={handleUpload}
          >
            {isUploading ? "Đang tải lên..." : "Tải lên"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
