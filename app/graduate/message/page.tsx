// src/app/graduate/message/page.tsx
'use client';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMessage, getMessages, deleteAmessage } from "@/actions/graduate/messageAction";
import MessagesList from "./_components/listMessage"; // Import the new component
import { Message } from "@/model/graduate/graduate";

export default function GraduationMessagePage() {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messagesList, setMessagesList] = useState<Message[]>([]);
    const [guestName, setGuestName] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("guestName");
        if (!stored) {
            router.replace("/graduate");
        } else {
            setGuestName(stored);

            const fetchMessages = async () => {
                setInitialLoading(true);
                const response = await getMessages(0, limit);

                if (!response.meta.success) {
                    console.log("gest list message lỏ");
                    setInitialLoading(false);
                    return null;
                }

                if (response.data) {
                    setMessagesList(response.data);
                    setOffset(response.data.length);
                    setHasMore(response.data.length === limit);
                }
                setInitialLoading(false);
            };

            fetchMessages();
        }
    }, [router]);

    const handleLoadMore = async () => {
        setLoading(true);
        const response = await getMessages(offset, limit);
        if (!response.meta.success) {
            setLoading(false);
            return;
        }
        if (response.data && response.data.length > 0) {
            setMessagesList(prev => [...response.data!, ...prev]);
            setOffset(prev => prev + response.data!.length);
            setHasMore(response.data.length === limit);
        } else {
            setHasMore(false);
        }
        setLoading(false);
    };

    

    const handleSubmit = async () => {
        const content = message.trim();
        if (!content) return;

        if (content.length < 20) {
            alert("Chúc chi ít rứa trời")
            return;
        }

        const respone = await createMessage({ content });

        if (!respone.meta.success) {
            alert("Chết mẹ dev lỏ");
            return;
        }

        const newMessage = respone.data;

        if (newMessage) {
            setMessagesList(prevList => [...prevList, newMessage]);
        }

        textareaRef.current?.focus();
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc muốn xóa tin nhắn này?")) return;
        setDeletingId(id);
        const response = await deleteAmessage(id);
        if (response?.meta?.success) {
            setMessagesList(prev => prev.filter(msg => msg.id !== id));
            setOffset(prev => Math.max(0, prev - 1));
        } else {
            alert("Xóa thất bại!");
        }
        setDeletingId(null);
    };

    return (
        <>
            <div className="w-full">
                <label className="block text-green-500 mb-2">
                    C:/{guestName}/message
                </label>
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        const target = e.target;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full min-h-[80px] text-green-300 px-2 border-none outline-none 
                   focus:outline-none focus:ring-0 focus:border-b focus:border-green-400 resize-none overflow-hidden bg-transparent"
                    placeholder=""
                />

                <div className="flex gap-4 mt-3">
                    <button
                        onClick={handleSubmit}
                        className="text-green-400 px-2 
                        focus:outline-none focus:border-b focus:border-green-400"
                    >
                        Gửi
                    </button>
                    <button
                        onClick={() => router.replace('/graduate/letter')}
                        onKeyDown={(e) => {
                            if (e.key === "Tab" && !e.shiftKey) {
                                e.preventDefault();
                                textareaRef.current?.focus();
                            }
                        }}
                        className="text-green-500 px-2
                        focus:outline-none focus:border-b focus:border-green-400"
                    >
                        Trở lại
                    </button>
                </div>
            </div>

            {initialLoading ? (
                <div className="flex justify-center items-center py-8">
                    <span className="text-green-400 animate-pulse">Loading...</span>
                </div>
            ) : (
                <MessagesList messages={messagesList} onDelete={handleDelete} deletingId={deletingId} />
            )}
            {hasMore && !initialLoading && (
                <div className="flex justify-center mt-2">
                    <button
                        onClick={handleLoadMore}
                        className="text-green-400 border border-green-400 px-4 py-1 rounded hover:bg-green-900/20 transition flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && <span className="animate-spin mr-2">⏳</span>}
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </>
    );
}
