'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // 👈 lấy query param
import riddleImg from '@/assets/hang/hang.jpg';

// Box hiển thị số với animation
function NumberBox({ value, label, fast = false }: { value: number; label: string; fast?: boolean }) {
  return (
    <div className="flex flex-col items-center mx-2">
      <div className="relative w-16 h-16 flex items-center justify-center bg-pink-200 rounded-xl shadow-md text-2xl font-bold text-pink-700 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 15, opacity: 0 }}
            transition={{ duration: fast ? 0.2 : 0.4 }}
            className="absolute"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-sm text-gray-600">{label}</span>
    </div>
  );
}

// Countdown component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    tick(); // chạy ngay lập tức
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="mt-8 flex justify-center">
      <NumberBox value={timeLeft.days} label="Ngày" />
      <NumberBox value={timeLeft.hours} label="Giờ" />
      <NumberBox value={timeLeft.minutes} label="Phút" />
      {/* giây nhảy nhanh hơn */}
      <NumberBox value={timeLeft.seconds} label="Giây" fast />
    </div>
  );
}

export default function BirthdayInvitationPage() {
  const eventDate = new Date("2025-09-18T19:30:00");

  // 👇 lấy query param
  const searchParams = useSearchParams();
  const guestName = searchParams.get("name") || "bạn";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 p-6 relative overflow-hidden">
      
      {/* Trang trí nền */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl">🎈</div>
        <div className="absolute top-20 right-20 text-4xl">🌸</div>
        <div className="absolute bottom-20 left-16 text-4xl">🎁</div>
        <div className="absolute bottom-10 right-24 text-4xl">✨</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center relative z-10 border-4 border-pink-200"
      >
        {/* Ảnh */}
        {/* Ảnh trang trí */}
<div className="relative flex justify-center mb-10">
  {/* Vòng sáng gradient */}
  <div className="absolute w-72 h-72 bg-gradient-to-tr from-pink-300 via-purple-200 to-yellow-200 rounded-full blur-2xl opacity-60 animate-pulse" />
  
  {/* Biểu tượng xung quanh */}
  <div className="absolute -top-4 left-12 text-3xl animate-bounce">🎈</div>
  <div className="absolute top-6 -right-4 text-2xl animate-spin-slow">✨</div>
  <div className="absolute bottom-4 left-6 text-3xl animate-bounce">🌸</div>
  <div className="absolute -bottom-6 right-12 text-3xl animate-bounce">🎁</div>

  <div className="relative flex justify-center mb-10">
  <Image
    src={riddleImg}
    alt="Ảnh sinh nhật"
    width={180}
    height={180}
    className="relative z-10 rounded-full shadow-2xl border-8 border-pink-200 object-cover"
  />
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">🌸</div>
  <div className="absolute top-12 -right-6 text-3xl">🎈</div>
  <div className="absolute bottom-6 -left-6 text-3xl">🎁</div>
  <div className="absolute -bottom-4 right-1/2 translate-x-1/2 text-3xl">✨</div>
</div>

</div>


        {/* Tiêu đề */}
        <h1 className="text-xl font-extrabold text-pink-600 mb-2">
          Thiệp Mời Sinh Nhật
        </h1>
        <p className="text-md text-gray-500 mb-6">
          Trân trọng kính mời <span className="font-bold text-pink-600">{guestName}</span> đến tham dự ngày đặc biệt này!
        </p>

        {/* Thông tin sự kiện */}
        <div className="space-y-4 text-left bg-pink-50 rounded-xl p-2 shadow-inner">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-yellow-600" />
            <span className="text-gray-800 font-medium text-md">
              Thứ Năm, 18/9/2025 - 19:30
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-pink-500" />
            <a
              href="https://www.google.com/maps/place/SimSimi+Qu%C3%A1n/@16.0488059,108.2315196,17.5z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 font-medium hover:underline text-pink-600"
            >
              SimSimi Quán, Đà Nẵng
            </a>
          </div>
        </div>

        {/* Đếm ngược */}
        <CountdownTimer targetDate={eventDate} />

        {/* Lời mời */}
        <p className="mt-8 text-gray-600 italic text-md">
        Thiệp này gửi gắm tấm lòng
        </p>
        <p className="text-gray-600 italic text-md">
        Mong {guestName} tới, kẻo không “ăn đòn
        </p>
      </motion.div>
    </div>
  );
}
