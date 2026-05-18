"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  coverUrl: string | null;
  galleryUrls: string[];
}

export function HotelGallery({ coverUrl, galleryUrls }: Props) {
  const slides = [
    ...(coverUrl ? [coverUrl] : []),
    ...galleryUrls,
  ];

  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;

  const current = slides[index];

  return (
    <div className="relative w-full aspect-[16/9] bg-ocean overflow-hidden rounded-lg">
      <Image
        src={current}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 66vw"
        className="object-cover"
      />
      {slides.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
