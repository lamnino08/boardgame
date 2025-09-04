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
  const [error, setError] = useState<string | null>(null); // Thêm state cho lỗi

  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const nameFromUrl = searchParams.get("name");
    if (nameFromUrl) {
      setGuestName(decodeURIComponent(nameFromUrl));
    }
  }, [searchParams]);

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

  useEffect(() => {
    if (confirmed && guestName.trim()) {
      const name = guestName.trim();
      if (name.length < 3) {
        setError("Tên phải có ít nhất 3 ký tự.");
        setConfirmed(false); // Reset confirmed state
        return;
      }

      setError(null);
      localStorage.setItem("guestName", name);
      router.push(`/graduate/letter`);
    }
  }, [confirmed, guestName, router]);

  // Hợp nhất logic xác nhận vào một hàm
  const handleConfirm = () => {
    const trimmedName = guestName.trim();
    if (trimmedName.length >= 3) {
      setError(null);
      confirmName({ name: trimmedName });
      setConfirmed(true);
      router.push(`/graduate/letter`);
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
              Lâm thường gọi bạn là gì:
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
                    placeholder="Type your name..."
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
