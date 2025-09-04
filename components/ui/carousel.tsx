'use client'

import React, { useState } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-neutral-900">
      {/* Hình ảnh */}
      <img
        src={images[currentIndex]}
        alt="carousel"
        className="w-full h-64 sm:h-80 object-cover"
      />

      {/* Nút điều hướng */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full shadow-md transition"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full shadow-md transition"
      >
        &#10095;
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full ${
              currentIndex === index
                ? 'bg-primary w-6 h-2'
                : 'bg-neutral-500 w-2 h-2 hover:bg-neutral-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

const sampleImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
];

export function CarouselShowcase() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Carousel Showcase</h2>

      {/* Default Carousel */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Default</h3>
        <Carousel images={sampleImages} />
      </div>

      {/* Smaller Carousel */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Compact Size</h3>
        <div className="max-w-md">
          <Carousel images={sampleImages} />
        </div>
      </div>

      {/* Multiple Carousels */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Two Carousels</h3>
        <div className="flex flex-col md:flex-row gap-8">
          <Carousel images={sampleImages} />
          <Carousel images={[...sampleImages].reverse()} />
        </div>
      </div>
    </div>
  );
}

