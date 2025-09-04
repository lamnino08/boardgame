"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Card from "@/components/ui/Card";
import Button from "./common/button/button";
import icons from "../icons";

interface ModalProps {
  isOpen: boolean;
  container?: {
    size?: "sm" | "md" | "lg" | "xl" | "full";
    className?: string;
  };
  header?: {
    title?: string;
    className?: string;
  };
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
  full: "max-w-full w-full h-full rounded-none",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  container = {},
  header = {},
  children,
  onClose,
  footer,
}) => {
  const [mounted, setMounted] = useState(false);

  // Đảm bảo chạy trên client (tránh SSR lỗi)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card
        className={`max-h-[80vh] w-full 
        ${sizeClasses[container.size || "md"]} ${container.className || ""}`}
      >
        {/* Header */}
        {(header.title) && (
          <div className={`flex justify-between items-center border-b border-border py-2 ${header.className || ""}`}>
            {header.title && (
              <h2 className="font-semibold text-text-primary">{header.title}</h2>
            )}
            {onClose && <Button variant="outline" onClick={onClose} icon={icons.close} />}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t border-border py-2">{footer}</div>}
      </Card>
    </div>,
    document.body
  );
};

export default Modal;


export const ModalShowcase: React.FC = () => {
  const [openModal, setOpenModal] = useState<null | "sm" | "md" | "lg" | "xl" | "full">(null);

  const closeModal = () => setOpenModal(null);

  const renderModal = (size: "sm" | "md" | "lg" | "xl" | "full") => (
    <Modal
      isOpen={openModal === size}
      onClose={closeModal}
      container={{
        size,
        className: "bg-bg-surface shadow-2xl rounded-xl",
      }}
      header={{
        title: `Modal - ${size.toUpperCase()}`,
      }}
      footer={
        <div className="flex justify-end gap-4">
          <Button onClick={closeModal} variant="secondary">
            Cancel
          </Button>
          <Button onClick={closeModal} variant="primary">
            Confirm
          </Button>
        </div>
      }
    >
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This is a <strong>{size.toUpperCase()}</strong> modal example.
        You can put any content here — forms, text, lists, or even images.
        Resize the modal by trying different buttons below.
      </p>
    </Modal>
  );

  return (
    <div className="p-8 space-y-6">
      <h2 className="font-bold">Modal Showcase</h2>
      <Card className="flex flex-wrap gap-4">
        {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
          <Button
            key={size}
            onClick={() => setOpenModal(size)}
            variant="primary"
          >
            Open {size.toUpperCase()} Modal
          </Button>
        ))}
      </Card>

      {/* Render the currently open modal */}
      {(["sm", "md", "lg", "xl", "full"] as const).map((size) => renderModal(size))}
    </div>
  );
};
