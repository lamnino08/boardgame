'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
    images: string[];
    autoPlay?: boolean;
    interval?: number;
    imageFit?: 'cover' | 'contain'; // Thêm prop này
}

const Carousel: React.FC<CarouselProps> = ({ images, autoPlay = true, interval = 3000, imageFit = 'cover' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const carouselVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            transition: { duration: 0.5 }
        }),
    };

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex(prevIndex => {
            let newIndex = prevIndex + newDirection;
            if (newIndex >= images.length) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = images.length - 1;
            }
            return newIndex;
        });
    }, [images.length]);

    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(() => {
            paginate(1);
        }, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, paginate]);

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-neutral-900 h-64 sm:h-80">
            <div className="w-full h-full relative flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`carousel-image-${currentIndex}`}
                        className={`absolute object-${imageFit} ${imageFit === "cover"
                                ? "w-full h-full"                 // cover: luôn fill khung
                                : "max-w-full max-h-full"         // contain: giữ tỉ lệ
                            }`}
                        custom={direction}
                        variants={carouselVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                    />
                </AnimatePresence>
            </div>

            {/* Nút điều hướng */}
            <button
                onClick={() => paginate(-1)}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full shadow-md transition z-10"
                aria-label="Previous slide"
            >
                &#10094;
            </button>
            <button
                onClick={() => paginate(1)}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full shadow-md transition z-10"
                aria-label="Next slide"
            >
                &#10095;
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center space-x-2 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (index > currentIndex) {
                                setDirection(1);
                            } else if (index < currentIndex) {
                                setDirection(-1);
                            }
                            setCurrentIndex(index);
                        }}
                        className={`transition-all rounded-full ${currentIndex === index
                            ? 'bg-white w-6 h-2'
                            : 'bg-neutral-500 w-2 h-2 hover:bg-neutral-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
