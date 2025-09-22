'use client'

import React, { useState, useRef, useEffect } from "react";

interface PostTitleProps {
  title?: string;
  onChange?: (newTitle: string) => void;
  allowEdit: boolean
}

export const PostTitle: React.FC<PostTitleProps> = ({ title = "", onChange, allowEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string>(title || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBlur = () => {
    setIsEditing(false);
    onChange?.(value);
  };

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  // Gọi khi mount và khi value thay đổi
  useEffect(() => {
    adjustHeight();
  }, [value, isEditing]);

  return (
    <div className="w-full">
      {isEditing ? (
        <textarea
          ref={textareaRef}
          autoFocus
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          placeholder="Title"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleBlur();
            }
          }}
          className="w-full text-4xl font-bold leading-normal bg-transparent resize-none outline-none border-none overflow-hidden focus:outline-none focus:border-transparent"
          rows={1}
        />

      ) : (
        <div
          className={`w-full text-4xl font-bold whitespace-pre-wrap break-words bg-transparent p-2 text-text-${value ? 'primary' : 'secondary'}`}
          onClick={() => {
            allowEdit && setIsEditing(true)
          }}
        >
          {value || "Title"}
        </div>
      )}
    </div>
  );
};
