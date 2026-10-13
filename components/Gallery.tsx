"use client";
import Image from "next/image";
import { useState } from "react";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand">
        <Image src={images[i]} alt={alt} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setI(idx)}
              className={`relative aspect-square overflow-hidden rounded-xl ring-2 ${idx === i ? "ring-brass" : "ring-transparent"}`}
              aria-label={`Show photo ${idx + 1}`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
