'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/common/button/button';
import icons from '@/components/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full ${sizeClasses[size]} mx-4 ${className}`}>
        <Card className="relative max-h-[90vh] overflow-hidden">
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              {title && (
                <h2 className="text-lg font-semibold text-text-primary">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100"
                >
                  {icons.close}
                </Button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Modal;
