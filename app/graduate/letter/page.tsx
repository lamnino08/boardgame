'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Left = { days: number; hours: number; minutes: number; seconds: number };

export default function GraduationLetter() {
    const router = useRouter();
    const [guestName, setGuestName] = useState<string | null>(null);

    // ref cho input lựa chọn
    const inputRef = useRef<HTMLInputElement>(null);

    function handleOption(value: string) {
        const option = value.trim();

        switch (option) {
            case "1":
                router.push("/graduate/message");
                break;
            case "4":
                router.push("/graduate/memory");
                break;
            case "2":
                router.push("/graduate/event-detail");
                break;
            case "3":
                router.push("/graduate/confirm");
                break;
            case "5":
                router.push("/graduate/game");
                break;
            default:
                alert("Chọn từ 1 đến 4 ạ.");
        }
    }

    // Lấy tên từ localStorage, nếu không có thì redirect
    useEffect(() => {
        const stored = localStorage.getItem("guestName");
        if (!stored) {
            router.replace("/graduate");
        } else {
            console.log(stored);
            setGuestName(stored);
        }
    }, [router]);

    // Khi render xong thì auto select input
    useEffect(() => {
        if (guestName && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [guestName]);

    // Mốc sự kiện: 7:30, 20/09 (năm hiện tại, nếu đã qua thì sang năm sau)
    const eventTime = useMemo(() => {
        const now = new Date();
        let y = now.getFullYear();
        let t = new Date(y, 8, 20, 10, 30, 0); // Tháng 9 là 8 (0-index)
        return t;
    }, []);

    const [left, setLeft] = useState<Left>(() => calcLeft(eventTime));

    useEffect(() => {
        const tick = () => setLeft(calcLeft(eventTime));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [eventTime]);

    if (!guestName) return null;

    const isStarted =
        left.days <= 0 && left.hours <= 0 && left.minutes <= 0 && left.seconds <= 0;

    return (
        <>
            {isStarted ? (
                <div className="mb-6 text-center">
                    <pre className="text-green-400 font-mono text-lg text-center mb-2">
                        {`╔══════════════════════════════════════════╗
║   *** Kỹ sư công nghệ phần mềm ***        ║
║             Phan Đức Lâm                  ║
║                xin chào                   ║
╚══════════════════════════════════════════╝`}
                    </pre>

                </div>
            ) : (
                <>
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-3xl md:text-5xl font-bold mb-2 text-center text-green-400"
                    >
                        <pre className="text-green-400 font-mono text-lg text-center mb-2">
                            {`╔══════════════════════╗
║ 🚀  PHAN DUC LAM  🚀 ║
╚══════════════════════╝`}
                        </pre>
                        {/* 🚀 Phan Đức Lâm */}
                    </motion.h1>
                    {/* Lời mời tham dự */}
                    <p className="mb-2 text-center text-md">
                        📢 Thân mời{" "}
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-green-400 font-bold drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                        >
                            {guestName}
                        </motion.span>{" "}
                        đến tham dự lễ tốt nghiệp của{" "}
                        <motion.span
                            animate={{ opacity: [1, 0.6, 1] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-green-400 font-bold mb-2"
                        >
                            Lâm
                        </motion.span>.
                    </p>

                    <p className='my-4 text-center text-sm'>
                        Một dấu mốc đáng nhớ trong hành trình của mình, nơi mà mỗi khoảnh khắc đều trở thành kỷ niệm, và sự hiện diện của bạn sẽ làm ngày đặc biệt này thêm phần đáng nhớ!
                    </p>

                    {/* Chi tiết sự kiện */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6 text-center"
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-sm md:text-base text-green-200/90"
                        >
                            🗓 Thứ Bảy,{" "}
                            <motion.span
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "easeInOut"
                                }}
                                className="text-green-400 inline-block"
                            >
                                11:00 · 20/09/2025
                            </motion.span>
                        </motion.p>
                        <p className="text-sm md:text-base text-green-200/80">
                            📍 Hội trường F, Trường Đại học Bách khoa - Đại học Đà Nẵng
                        </p>
                    </motion.div>
                </>
            )}

            {/* Countdown */}
            {!isStarted && (
                <div className="flex gap-3 md:gap-4 mb-8">
                    <TimeBox label="Ngày" value={Math.max(0, left.days)} />
                    <TimeBox label="Giờ" value={Math.max(0, left.hours)} />
                    <TimeBox label="Phút" value={Math.max(0, left.minutes)} />
                    <TimeBox label="Giây" value={Math.max(0, left.seconds)} />
                </div>)
            }

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.8 }}
                className="bg-black rounded-xl shadow-lg p-6 w-full max-w-lg border border-green-500"
            >
                <pre className="text-left text-green-300 text-sm md:text-base leading-relaxed">
                    {`> 1. Gửi lời chúc mừng 🎉
> 2. Xem thông tin sự kiện 📅
> 3. Xác nhận tham gia 🚀
> 4. Chia sẻ một kỷ niệm ✨
 `}
                </pre>





                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                    <span className="text-green-400">C:\\{guestName}&gt;</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-black text-green-300 px-2 border-none outline-none w-full sm:w-auto
            focus:outline-none focus:ring-0 focus:border-b focus:border-green-400"
                        // placeholder="Enter option..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleOption(e.currentTarget.value);
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            if (inputRef.current) {
                                handleOption(inputRef.current.value);
                            }
                        }}
                        className="text-green-400 px-2 
            focus:outline-none focus:border-b focus:border-green-400"
                    >
                        Enter
                    </button>
                </div>

            </motion.div>

            {/* Trạng thái sự kiện */}
            <motion.div
                key={isStarted ? 'started' : 'waiting'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 text-green-200/90"
            >
                <p>
                    {isStarted
                        ? '🎉 Sự kiện đang bắt đầu! Hẹn gặp bạn ở lễ tốt nghiệp.'
                        : '⌛ Đếm ngược tới giờ G...'}
                </p>
                <pre className="text-left text-red-700 text-sm md:text-base leading-relaxed">
                    {`** Thời gian (10h30) là dự kiến và có thể thay đổi`}
                </pre>
            </motion.div>
        </>
    );
}

/* --------- Helpers --------- */
function calcLeft(target: Date): Left {
    const diff = target.getTime() - Date.now();
    const total = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(total / (3600 * 24));
    const hours = Math.floor((total % (3600 * 24)) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return { days, hours, minutes, seconds };
}

function pad(n: number) {
    return n.toString().padStart(2, '0');
}

function formatVi(d: Date) {
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const DD = pad(d.getDate());
    const MM = pad(d.getMonth() + 1);
    const YYYY = d.getFullYear();
    return `${hh}:${mm} · ${DD}/${MM}/${YYYY}`;
}

/* Hộp thời gian */
function TimeBox({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ y: -6, opacity: 0.8, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                className="min-w-[72px] md:min-w-[92px] px-4 py-3 bg-black/60 border border-green-500/60 rounded-xl text-center shadow"
            >
                <span className="text-2xl md:text-3xl font-bold text-green-400 tabular-nums">
                    {pad(value)}
                </span>
            </motion.div>
            <span className="mt-2 text-xs md:text-sm text-green-200/80">{label}</span>
        </div>
    );
}
