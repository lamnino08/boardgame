'use client';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import Carousel from "../memory/_component/carousel"; // Import the Carousel component
import { uploadFiles, deleteFile } from '@/actions/upload/uploadAction';
import { createMemory, getMemoryForGuest, deleteMemory } from '@/actions/graduate/memoryAction';
import ListMemory from './_component/listMemory';
import { Memory } from "@/model/graduate/graduate";

export default function GraduationMemoryPage() {
    const router = useRouter();
    const [guestName, setGuestName] = useState<string | null>(null);
    const [currentCaption, setCurrentCaption] = useState("");
    const [selectedImages, setSelectedImages] = useState<{ url: string; uploadedUrl?: string; uploading: boolean; error?: string; file?: File }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const captionInputRef = useRef<HTMLTextAreaElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [memoryList, setMemoryList] = useState<Memory[]>([]);
    const [memoryLoading, setMemoryLoading] = useState(true);
    const [memoryError, setMemoryError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 1;

    useEffect(() => {
        const stored = localStorage.getItem("guestName");
        if (!stored) {
            router.replace("/graduate");
        } else {
            setGuestName(stored);
        }
    }, [router]);

    useEffect(() => {
        if (selectedImages.length > 0 && captionInputRef.current) {
            captionInputRef.current.focus();
        }
    }, [selectedImages]);

    useEffect(() => {
        const fetchMemories = async () => {
            setMemoryLoading(true);
            setMemoryError(null);
            try {
                const res = await getMemoryForGuest(0, LIMIT);
                if (res.meta.success && res.data) {
                    setMemoryList(res.data);
                    setHasMore(res.data.length === LIMIT);
                } else {
                    setMemoryError('Không thể tải danh sách kỷ niệm.');
                }
            } catch (err) {
                setMemoryError('Lỗi khi tải kỷ niệm.');
            }
            setMemoryLoading(false);
        };
        fetchMemories();
    }, []);

    // Handle file selection and upload all at once immediately
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadError(null);
        // Preview all files immediately
        const previewImages = Array.from(files).map(file => ({
            file,
            url: URL.createObjectURL(file),
            uploading: true,
        }));
        setSelectedImages(prev => [...prev, ...previewImages]);
        try {
            const res = await uploadFiles(Array.from(files));
            if (!res.meta.success || !res.data || res.data.length !== files.length) {
                setUploadError('Upload failed!');
                // Mark all as error
                setSelectedImages(prev => prev.map((img, idx) =>
                    idx >= prev.length - files.length ? { ...img, uploading: false, error: 'Upload failed!' } : img
                ));
                setUploading(false);
                return;
            }
            // Map returned URLs to preview images
            setSelectedImages(prev => prev.map((img, idx) =>
                idx >= prev.length - files.length && res.data
                    ? { ...img, uploadedUrl: res.data[idx - (prev.length - files.length)], uploading: false, error: undefined }
                    : img
            ));
        } catch (err) {
            setUploadError('Upload failed!');
            setSelectedImages(prev => prev.map((img, idx) =>
                idx >= prev.length - files.length ? { ...img, uploading: false, error: 'Upload failed!' } : img
            ));
        }
        setUploading(false);
    };

    // Remove image from preview (and delete from server if uploaded)
    const handleRemoveImage = async (idx: number) => {
        const img = selectedImages[idx];
        if (img.uploadedUrl) {
            try {
                await deleteFile(img.uploadedUrl);
            } catch { }
        }
        setSelectedImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleAddMemory = async () => {
        if (!currentCaption.trim()) {
            alert("Không muốn nhắn nhủ gì à");
            return;
        }
        // Only use uploaded images
        const uploadedUrls = selectedImages.filter(img => img.uploadedUrl).map(img => img.uploadedUrl!);
        if (uploadedUrls.length === 0) {
            alert("Không có ảnh à");
            return;
        }

        const result = await createMemory({ caption: currentCaption.trim(), images: uploadedUrls });

        if (result?.meta?.success && result.data) {
            setMemoryList(prev => [result.data as Memory, ...prev]);
        }

        setCurrentCaption("");
        setSelectedImages([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await deleteMemory(id);
            if (res?.meta?.success) {
                setMemoryList(prev => prev.filter(m => m.id !== id));
            } else {
                alert('Xóa kỷ niệm thất bại!');
            }
        } catch (err) {
            alert('Xóa kỷ niệm thất bại!');
        } finally {
            setDeletingId(null);
        }
    };

    const handleLoadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        setMemoryError(null);
        try {
            const offset = memoryList.length;
            const res = await getMemoryForGuest(offset, LIMIT);
            if (res.meta.success) {
                const items = res.data ?? [];
                setMemoryList(prev => [...prev, ...items]);
                setHasMore(items.length === LIMIT);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setMemoryError('Lỗi khi tải thêm kỷ niệm.');
        }
        setLoadingMore(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleAddMemory();
        }
    };

    // Remove all uploaded images (for cancel/back)
    const handleClearUploadedImages = async () => {
        const uploadedImages = selectedImages.filter(img => img.uploadedUrl);
        await Promise.all(
            uploadedImages.map(img =>
                deleteFile(img.uploadedUrl!).catch(() => {})
            )
        );
        setSelectedImages([]);
        setCurrentCaption("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full"
            >
                <label className="block text-green-500 mb-2">
                    C:/{guestName}/memory
                </label>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="w-full flex flex-col items-center max-w-2xl mt-4"
            >
                <div className="border-2 border-dashed border-green-500 rounded-lg p-6 w-full text-center cursor-pointer hover:bg-black/20 transition-colors mb-4">
                    <label htmlFor="file-upload" className="block cursor-pointer">
                        <span className="text-green-300 text-base">
                            {selectedImages.length === 0 ? "🖼 Chọn ảnh" : `🖼 Đã chọn ${selectedImages.length} ảnh. Nhấn để chọn thêm!`}
                        </span>
                        <input
                            id="file-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
                {selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-2 w-full">
                        {selectedImages.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 border border-green-700 rounded overflow-hidden flex flex-col items-center justify-center bg-black/40">
                                <img src={img.url} alt="preview" className="object-cover w-full h-full" />
                                {img.uploading && <span className="absolute inset-0 flex items-center justify-center text-xs text-green-300 bg-black/60">Uploading...</span>}
                                {img.error && <span className="absolute inset-0 flex items-center justify-center text-xs text-red-400 bg-black/60">Error</span>}
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-black/60 text-red-400 rounded-full px-2 py-0.5 text-xs hover:bg-red-700/80"
                                    onClick={() => handleRemoveImage(idx)}
                                    disabled={img.uploading}
                                    title="Xóa ảnh này"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {uploadError && <div className="text-red-400 text-xs mb-2">{uploadError}</div>}

                {selectedImages.length > 0 && (
                    <motion.div
                        key="image-caption-area"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="w-full mb-6 p-4 border border-green-700 rounded-lg bg-black/50"
                    >
                        <h4 className="text-green-400 text-left mb-3 text-base md:text-lg">
                            Xem lại ảnh đã chọn:
                        </h4>
                        <div className="mb-4">
                            <Carousel images={selectedImages.map(img => img.url)} autoPlay={false} />
                        </div>

                        <textarea
                            ref={captionInputRef}
                            value={currentCaption}
                            onChange={(e) => setCurrentCaption(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full min-h-[80px] text-green-300 px-2 border-none outline-none 
             focus:outline-none focus:ring-0 focus:border-b focus:border-green-400 resize-none overflow-hidden bg-transparent"
                        // placeholder=""
                        />
                        <div className="flex justify-end gap-4 mt-3">
                            <button
                                onClick={handleAddMemory}
                                className="text-green-500 px-2 focus:outline-none focus:border-b focus:border-green-400"
                                disabled={uploading || selectedImages.some(img => img.uploading)}
                            >
                                {uploading ? 'Đang upload...' : 'Lưu kỷ niệm'}
                            </button>
                            <button
                                onClick={() => {
                                    handleClearUploadedImages();
                                }}
                                className="text-red-500 px-2
                   focus:outline-none focus:border-b focus:border-red-400"
                            >
                                Hủy
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex gap-4 mt-8"
            >
                <button
                    onClick={async () => {
                        await handleClearUploadedImages();
                        router.back();
                    }}
                    className="text-green-500 px-2
                   focus:outline-none focus:border-b focus:border-green-400"
                >
                    &lt; Trở lại
                </button>

            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col items-center gap-4 mt-8 text-center"
            >
                <p className="text-green-300 text-sm">
                    🌟Sau lễ, đừng quên quay lại để lưu giữ thêm nhiều khoảnh khắc đáng nhớ nhé!
                </p>
            </motion.div>

            {/* Hiển thị danh sách kỷ niệm */}
            {memoryLoading ? (
                <div className="text-green-400 text-center mt-8">Đang tải kỷ niệm...</div>
            ) : memoryError ? (
                <div className="text-red-400 text-center mt-8">{memoryError}</div>
            ) : (
                <>
                    <ListMemory memories={memoryList} onDelete={handleDelete} deletingId={deletingId} />
                    {hasMore && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="text-green-500 px-3 py-1 border border-green-600 rounded hover:bg-green-600/10 disabled:opacity-50"
                            >
                                {loadingMore ? 'Đang tải...' : 'Tải thêm'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
