// src/components/MessagesList.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/model/graduate/graduate';

interface MessagesListProps {
    messages: Message[];
    onDelete?: (id: string) => void;
    deletingId?: string | null;
}

export default function MessagesList({ messages, onDelete, deletingId }: MessagesListProps) {
    const formatTimestamp = (timestamp: string | Date) => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
        };
        return date.toLocaleString('vi-VN', options);
    };

    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 w-full flex justify-center">
            <div className="w-full max-w-2xl p-2 sm:p-4 font-mono text-green-400 bg-transparent" style={{ minHeight: '200px', borderRadius: '6px' }}>
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ x: -40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 40, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="w-full"
                        >
                            <div className="text-green-600 text-xs mb-1">[{formatTimestamp(msg.created_at)}]</div>
                            <div className="flex items-center gap-2 break-words overflow-x-auto whitespace-pre-wrap w-full">
                                <span className="text-green-300 text-sm md:text-base flex-1 break-words">{msg.content}</span>
                                {onDelete && (
                                    <motion.button
                                        // whileHover={{ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } }}
                                        className="text-red-400 text-xs ml-2 hover:underline shrink-0 disabled:opacity-50"
                                        onClick={() => onDelete(msg.id)}
                                        title="Delete message"
                                        disabled={deletingId === msg.id}
                                    >
                                        {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}