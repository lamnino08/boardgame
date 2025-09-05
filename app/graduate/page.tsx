'use client'
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmName } from "@/actions/graduate/guestAction";

const asciiFrames = [
  "[=               ] 2020",
  "[==              ] 2021",
  "[====            ] 2022",
  "[=========       ] 2023",
  "[============    ] 2024",
  "[================] 2025",
];

export default function GraduationPage() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"intro" | "typing" | "ascii" | "done">("intro");
  const [typedCommand, setTypedCommand] = useState("");
  const command = "npm run student";
  const [frameIndex, setFrameIndex] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewGuest, setIsNewGuest] = useState(false); // Thêm state cho khách mới

  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hàm lấy danh sách guest từ localStorage
  const getGuestList = () => {
    const stored = localStorage.getItem("guestList");
    return stored ? JSON.parse(stored) : [];
  };

  // Hàm lưu danh sách guest vào localStorage
  const saveGuestList = (guestList: Array<{link: string, name: string}>) => {
    localStorage.setItem("guestList", JSON.stringify(guestList));
  };

  // Hàm lưu guestName hiện tại vào localStorage
  const saveCurrentGuestName = (name: string) => {
    localStorage.setItem("guestName", name);
  };

  // Hàm tìm guest theo link
  const findGuestByLink = (link: string) => {
    const guestList = getGuestList();
    return guestList.find((guest: {link: string, name: string}) => guest.link === link);
  };

  useEffect(() => {
    const nameFromUrl = searchParams.get("name");
    if (nameFromUrl) {
      const decodedName = decodeURIComponent(nameFromUrl);
      const currentLink = `graduate?name=${nameFromUrl}`;
      
      // Tìm guest trong danh sách
      const existingGuest = findGuestByLink(currentLink);
      
      if (existingGuest) {
        // Nếu đã có trong danh sách, set tên và chuyển sang letter
        setGuestName(existingGuest.name);
        saveCurrentGuestName(existingGuest.name);
        router.replace("/graduate/letter");
        return;
      } else {
        // Nếu chưa có, set tên từ URL và đánh dấu là khách mới
        setGuestName(decodedName);
        setIsNewGuest(true);
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    const guestList = getGuestList();
    if (guestList.length > 0 && !searchParams.get("name")) {
      // Nếu có danh sách guest nhưng không có params, chuyển sang letter
      router.replace("/graduate/letter");
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (step === "intro") {
      setTimeout(() => setStep("typing"), 2000);
    }

    if (step === "typing") {
      let i = 0;
      const typingInterval = setInterval(() => {
        setTypedCommand(command.slice(0, i + 1));
        i++;
        if (i === command.length) {
          clearInterval(typingInterval);
          setTimeout(() => setStep("ascii"), 1000);
        }
      }, 150);
      return () => clearInterval(typingInterval);
    }

    if (step === "ascii") {
      let idx = 0;
      const asciiInterval = setInterval(() => {
        setFrameIndex(idx);
        idx++;
        if (idx === asciiFrames.length) {
          clearInterval(asciiInterval);
          setTimeout(() => {
            setStep("done");
            setTimeout(() => setLoading(false), 1000);
          }, 1500);
        }
      }, 800);
      return () => clearInterval(asciiInterval);
    }
  }, [step]);

  useEffect(() => {
    if (!loading && !confirmed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, confirmed]);

  // Logic này đã được chuyển vào handleConfirm

  // Hợp nhất logic xác nhận vào một hàm
  const handleConfirm = async () => {
    const trimmedName = guestName.trim();
    if (trimmedName.length >= 3) {
      setError(null);
      await confirmName({ name: trimmedName });
      setConfirmed(true);
      
      // Lưu vào danh sách guest
      const guestList = getGuestList();
      const nameFromUrl = searchParams.get("name");
      const currentLink = nameFromUrl ? `graduate?name=${nameFromUrl}` : `graduate?name=${encodeURIComponent(trimmedName)}`;
      
      // Kiểm tra xem link đã tồn tại chưa
      const existingIndex = guestList.findIndex((guest: {link: string, name: string}) => guest.link === currentLink);
      
      if (existingIndex >= 0) {
        // Cập nhật tên cho link đã tồn tại
        guestList[existingIndex].name = trimmedName;
      } else {
        // Thêm guest mới vào danh sách
        guestList.push({
          link: currentLink,
          name: trimmedName
        });
      }
      
      saveGuestList(guestList);
      saveCurrentGuestName(trimmedName);
      router.replace(`/graduate/letter?name=${encodeURIComponent(trimmedName)}`);
    } else {
      if (!loading && !confirmed && inputRef.current) {
        inputRef.current.focus();
      }
      setError("Tên phải có ít nhất 3 ký tự.");
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black text-green-400"
          >
            {step === "intro" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="text-sm bg-black border border-green-600 rounded p-4 shadow-lg"
              >
                C:\lamnino&gt;
              </motion.div>
            )}

            {step === "typing" && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                className="text-lg md:text-xl"
              >
                C:\lamnino&gt; {typedCommand}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  █
                </motion.span>
              </motion.div>
            )}

            {step === "ascii" && (
              <div className="text-lg md:text-xl">
                <p>C:\lamnino&gt; npm run student</p>
                <motion.pre
                  key={frameIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4"
                >
                  {asciiFrames[frameIndex]}
                </motion.pre>
              </div>
            )}
          </motion.div>
        )}

        {!loading && (
          <motion.div
            key="askname"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-green-400 p-6"
          >
            <pre className="text-green-400 font-mono mb-2">
              {`     ?
  _____
 /     \\
| O   O |
|   ^   |
|  ---  |
 \\_____/`}
            </pre>
            <label className="mb-4 w-full max-w-sm text-lg">
              {isNewGuest ? "Lâm thường gọi bạn là gì:" : "Xác nhận tên của bạn:"}
              <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-1">
                <div className="flex items-center w-full">
                  <input
                    ref={inputRef}
                    type="text"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value);
                      setError(null); // Xóa lỗi khi người dùng gõ lại
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleConfirm();
                      }
                    }}
                    className="w-full min-h-[80px] text-green-300 px-2 border-none outline-none 
             focus:outline-none focus:ring-0 focus:border-b focus:border-green-400 resize-none overflow-hidden bg-transparent"
                    placeholder={isNewGuest ? "Type your name..." : "Confirm your name..."}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="text-green-400 px-2 
                   focus:outline-none focus:border-b focus:border-green-400"
                  >
                    Enter
                  </button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-2 font-mono"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
