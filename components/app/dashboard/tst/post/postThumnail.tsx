'use client'

import React, { useState, useEffect } from "react";
import FileInput from "@/components/ui/form/base-component/file-input";
import { EAlertType, useAlert } from "@/contexts/alert-context";
import { deleteFile } from "@/actions/upload/uploadAction";
import Image from "next/image";
import { updateThumbnail } from "@/actions/tst/TSTPostAction";
import { Post } from "@/model/tst/post";
import { EUploadType } from "@/constant/upload/allowUploadType";
import Button from "@/components/ui/common/button/button";

interface PostThumbnailProps {
  post: Post | undefined;
  allowEdit: boolean;
}

export const PostThumbnail: React.FC<PostThumbnailProps> = ({
  post,
  allowEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentThumbnail, setCurrentThumbnail] = useState<string>(post?.avatar_url || "");
  const [showFileInput, setShowFileInput] = useState(false); // 👈 state kiểm soát hiển thị
  const showAlert = useAlert();

  useEffect(() => {
    setCurrentThumbnail(post?.avatar_url || "");
  }, [post]);

  const handleFileUpload = async (files: string[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      if (currentThumbnail) {
        try {
          await deleteFile(currentThumbnail);
        } catch (error) {
          showAlert("Failed to delete old thumbnail. Please try again.", EAlertType.ERROR);
        }
      }

      const response = await updateThumbnail(post?.id || "", files[0]);
      if (response.meta.success) {
        setCurrentThumbnail(files[0]);
        setShowFileInput(false);
      } else {
        showAlert(response.meta.external_message, EAlertType.ERROR);
      }
    } catch (error) {
      showAlert("Upload failed. Please try again.", EAlertType.ERROR);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveThumbnail = async () => {
    try {
      if (currentThumbnail) {
        await deleteFile(currentThumbnail);
      }
    } catch (error) {
      showAlert("Failed to delete thumbnail. Please try again.", EAlertType.ERROR);
    }
    setCurrentThumbnail("");
  };

  return (
    <div className="w-full space-y-4 px-2">
      {allowEdit && (
        <>
          {showFileInput ? (
            <FileInput
              label="Upload Thumbnail"
              accept="image/*"
              uploadType={EUploadType.TST_POST}
              id={post?.id}
              maxSizeMB={5}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          ) : (
            <Button
              onClick={() => setShowFileInput(true)}
              disabled={isUploading}
              size="sm"
            >
              Change Thumbnail
            </Button>
          )}
        </>
      )}

      {currentThumbnail ? (
        <div className="space-y-2">
          <div className="w-full aspect-[16/9] relative rounded-lg border border-muted overflow-hidden">
            <Image
              src={currentThumbnail}
              alt="Post thumbnail"
              fill
              className="object-cover"
            />
          </div>
          {allowEdit && (
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleRemoveThumbnail}
                disabled={isUploading}
                variant="ghost"
              >
                Remove thumbnail
              </Button>
            </div>
          )}
        </div>
      ) : (
        !allowEdit && (
          <div className="w-full aspect-[16/9] border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-text-secondary mb-2">📷</div>
              <p className="text-text-secondary">No thumbnail</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PostThumbnail;
