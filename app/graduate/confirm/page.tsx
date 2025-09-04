'use client';

import React, { useEffect, useRef, useState } from 'react';
import { confirmAttend, cancelConfirmAttend, getGuestConfirmStatus } from '@/actions/graduate/guestAction';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const celebrationRef = useRef<HTMLDivElement>(null);
    const [noBtn, setNoBtn] = useState({ top: 60, left: 60 });
    const [isNoFloating, setIsNoFloating] = useState(false); // khi true thì nút "Không" chuyển sang chế độ né
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<boolean | null>(null); // true: đã xác nhận, false: đã hủy/không, null: chưa biết
    const [actionLoading, setActionLoading] = useState<'confirm' | 'cancel' | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getGuestConfirmStatus();
                if (res.meta?.success) {
                    setStatus(!!res.data);
                } else {
                    setError('Không lấy được trạng thái xác nhận.');
                }
            } catch (e) {
                setError('Lỗi khi lấy trạng thái xác nhận.');
            }
            setLoading(false);
        };
        fetchStatus();
    }, []);

    const randomPos = () => {
        const box = containerRef.current?.getBoundingClientRect();
        if (!box) return { top: 50, left: 50 };
        const padding = 8;
        const top = Math.max(0, Math.min(100, ((Math.random() * (box.height - 40 - padding * 2)) + padding) / box.height * 100));
        const left = Math.max(0, Math.min(100, ((Math.random() * (box.width - 100 - padding * 2)) + padding) / box.width * 100));
        return { top, left };
    };

    const teleportNo = () => {
        setNoBtn(randomPos());
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isNoFloating) return;
        const box = containerRef.current?.getBoundingClientRect();
        if (!box) return;
        const cursorX = e.clientX - box.left;
        const cursorY = e.clientY - box.top;
        const dangerRadius = 90; // px
        const btnX = (noBtn.left / 100) * box.width + 40;
        const btnY = (noBtn.top / 100) * box.height + 16;
        const dx = btnX - cursorX;
        const dy = btnY - cursorY;
        const dist = Math.hypot(dx, dy);
        if (dist < dangerRadius) teleportNo();
    };

    const triggerConfetti = () => {
        const host = celebrationRef.current;
        const frame = containerRef.current;
        if (!host || !frame) return;
        const rect = frame.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const total = 80;
        for (let i = 0; i < total; i++) {
            const el = document.createElement('span');
            el.className = 'confetti-piece';
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 140; // px
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance * (0.7 + Math.random() * 0.6);
            const rot = (Math.random() * 720 - 360).toFixed(1);
            const hue = Math.floor(100 + Math.random() * 80); // xanh lá chủ đạo
            el.style.left = `${centerX}px`;
            el.style.top = `${centerY}px`;
            (el.style as any)['--tx'] = `${dx}px`;
            (el.style as any)['--ty'] = `${dy}px`;
            (el.style as any)['--rot'] = `${rot}deg`;
            (el.style as any)['--hue'] = `${hue}`;
            host.appendChild(el);
            setTimeout(() => el.remove(), 1100);
        }
        // Shockwave ring
        const ring = document.createElement('div');
        ring.className = 'confetti-ring';
        ring.style.left = `${centerX}px`;
        ring.style.top = `${centerY}px`;
        host.appendChild(ring);
        setTimeout(() => ring.remove(), 700);
    };

    const doConfirm = async () => {
        try {
            setActionLoading('confirm');
            setError(null);
            const res = await confirmAttend();
            if (res.meta?.success) {
                setStatus(true);
                triggerConfetti();
                alert('Cảm ơn bạn đã xác nhận tham gia!');
            } else {
                setError('Xác nhận thất bại. Vui lòng thử lại.');
            }
        } catch {
            setError('Xác nhận thất bại. Vui lòng thử lại.');
        } finally {
            setActionLoading(null);
        }
    };

    const doCancel = async () => {
        try {
            setActionLoading('cancel');
            setError(null);
            const res = await cancelConfirmAttend();
            if (res.meta?.success) {
                setStatus(false);
                alert('Bạn đã hủy xác nhận.');
            } else {
                setError('Hủy xác nhận thất bại.');
            }
        } catch {
            setError('Hủy xác nhận thất bại.');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="w-full flex justify-center px-4">
            <div className="w-full max-w-xl mt-10 items-center">
                <div className="w-full flex items-center justify-between mb-2">
                    <h1 className="text-green-400 text-lg">Xác nhận tham gia</h1>
                </div>
                {loading ? (
                    <p className="text-center text-green-300">Đang tải trạng thái...</p>
                ) : (
                    <div className='flex flex-col justify-center'>
                        {error && <p className="text-center text-red-400 text-sm mb-2">{error}</p>}
                        {!status && (
                            <div
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                className="relative h-[120px] w-full border border-green-700 rounded-lg bg-black/60 overflow-hidden flex items-center justify-center"
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={doConfirm}
                                        disabled={actionLoading === 'confirm'}
                                        className="select-none text-green-500 px-5 py-2 border border-green-700 rounded hover:bg-green-600/10 disabled:opacity-50"
                                    >
                                        OK
                                    </button>

                                    <button
                                        onMouseEnter={() => { setIsNoFloating(true); teleportNo(); }}
                                        onFocus={() => { setIsNoFloating(true); teleportNo(); }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isNoFloating) teleportNo();
                                        }}
                                        style={isNoFloating ? { position: 'absolute' as const, top: `${noBtn.top}%`, left: `${noBtn.left}%` } : undefined}
                                        className={`select-none ${isNoFloating ? 'cursor-default absolute' : ''} text-red-400 px-4 py-2 border border-red-600 rounded hover:bg-red-600/10`}
                                        title="Không đồng ý"
                                    >
                                        Không
                                    </button>
                                </div>
                                {/* Overlay container cho hiệu ứng */}
                                <div ref={celebrationRef} className="pointer-events-none absolute inset-0"></div>
                            </div>
                        )}

                        {/* Nút phụ để hủy xác nhận thật sự, cập nhật ngay trạng thái */}
                        {status && (
                            <div className="text-center mt-3">
                                <button
                                    onClick={doCancel}
                                    disabled={actionLoading === 'cancel'}
                                    className="text-red-400 text-xs border border-red-600 rounded px-3 py-1 hover:bg-red-600/10 disabled:opacity-50"
                                >
                                    Hủy xác nhận
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => router.replace('/graduate/letter')}
                            className="text-green-500 px-2 border border-green-700 rounded hover:bg-green-600/10 mt-2"
                        >
                            &lt; Trở lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
