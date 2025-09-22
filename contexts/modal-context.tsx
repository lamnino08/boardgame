"use client";

import { CloseIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/common/button/button";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ModalRenderer = React.ReactNode | null;

type OpenOptions = {
  title?: {
    content: string,
    align?: 'left' | 'center' | 'right',
    className?: string
  };
  size?: "sm" | "md" | "lg" | "xl";
  dismissOnBackdrop?: boolean;
};

interface ModalContextType {
  openModal: <T = any>(content: (resolve: (value: T) => void, reject: (reason?: any) => void) => React.ReactNode, options?: OpenOptions) => Promise<T>;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<OpenOptions | undefined>(undefined);
  const resolverRef = useRef<((value: any) => void) | null>(null);
  const rejecterRef = useRef<((reason?: any) => void) | null>(null);
  const [renderer, setRenderer] = useState<ModalRenderer>(null);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setRenderer(null);
    resolverRef.current = null;
    rejecterRef.current = null;
    setOptions(undefined);
  }, []);

  const openModal = useCallback(<T,>(content: (resolve: (value: T) => void, reject: (reason?: any) => void) => React.ReactNode, opts?: OpenOptions) => {
    setOptions(opts);
    return new Promise<T>((resolve, reject) => {
      const safeResolve = (value: T) => {
        resolve(value);
        closeModal();
      };
      const safeReject = (reason?: any) => {
        reject(reason);
        closeModal();
      };
      resolverRef.current = safeResolve as any;
      rejecterRef.current = safeReject as any;
      setRenderer(() => content(safeResolve as any, safeReject));
      setIsOpen(true);
    });
  }, [closeModal]);

  const ctxValue = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalContext.Provider value={ctxValue}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => {
              if (options?.dismissOnBackdrop !== false) {
                rejecterRef.current?.("dismissed");
                closeModal();
              }
            }}
          />
          {(() => {
            const sizeMap: Record<string, string> = {
              sm: "max-w-md",
              md: "max-w-lg",
              lg: "max-w-2xl",
              xl: "max-w-4xl",
            };
            const sizeClass = sizeMap[options?.size || "md"] || sizeMap.md;
            return (
              <div className={`relative w-full ${sizeClass} mx-4 animate-in fade-in zoom-in duration-150`}>
                <Card>
                  {(options?.title) && (
                    <div className="flex items-center justify-between px-5 border-b border-border/60 bg-background/60">
                      <h3 className="text-base text-lg text-text-primary">{options.title.content}</h3>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          rejecterRef.current?.("dismissed");
                          closeModal();
                        }}
                      >
                        {CloseIcon}
                      </Button>
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    {renderer}
                  </div>
                </Card>
              </div>
            );
          })()}
        </div>
      )}
    </ModalContext.Provider>
  );
}
