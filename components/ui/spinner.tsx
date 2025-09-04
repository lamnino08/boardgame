import React, { useState, useEffect } from "react";

interface ASCIILoadingWaveProps {
  frames?: string[]; // Các khung ASCII của hiệu ứng
  interval?: number; // Thời gian chuyển khung (ms)
}

export const ASCIILoading: React.FC<ASCIILoadingWaveProps> = ({
  frames = ["💰   ", " 💰  ", "  💰 ", "   💰", "  💰 "],
  interval = 200,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, interval);
    return () => clearInterval(timer);
  }, [frames.length, interval]);

  return (
    <pre
      style={{
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#e90000",
        textAlign: "left",
      }} 
    >
      {frames[currentFrame]}
    </pre>
  );
};

