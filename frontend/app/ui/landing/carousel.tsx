'use client';
import Image from "next/image";

import { useState } from "react";

const images = [
  "/carousel/rag_project.png",
  "/carousel/c2.png"
];

export default function CarouselLanding() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full">
      {/* <div className="relative h-56 overflow-hidden rounded-lg md:h-96"> */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-lg">
        {images.map((src, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === current ? "opacity-100" : "opacity-0"}`}>
            {/*<Image src={src} className="block w-full h-full object-cover" fill alt={`Slide ${idx + 1}`}/>*/}
            <Image src={src} fill className="object-cover" alt={`Slide ${idx + 1}`} />
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 bottom-5 left-1/2">
        {images.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${current === idx ? "bg-white" : "bg-gray-400"}`} aria-label={`Slide ${idx + 1}`}/>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          ◀
        </span>
      </button>
      <button onClick={nextSlide} className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          ▶
        </span>
      </button>
    </div>
  );
}
