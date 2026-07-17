"use client";

import Image from "next/image";
import { useState } from "react";

export default function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] || images[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-brand-surface">
        {main ? (
          <Image
            src={main}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-muted">
            No image
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 overflow-hidden rounded-lg border ${
                active === i ? "border-brand-primary" : "border-brand-line"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
