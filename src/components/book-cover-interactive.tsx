"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** Tailwind aspect class, e.g. aspect-[3/4] */
  aspectClass?: string;
  sizes: string;
  /**
   * Lifts and angles the cover like a real book sitting above the card,
   * separate from the “Buy now” block.
   */
  detached?: boolean;
};

/**
 * Cover with optional “detached book” look + motion.
 */
export function BookCoverInteractive({
  src,
  alt,
  aspectClass = "aspect-[3/4]",
  sizes,
  detached = false,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [finePointer, setFinePointer] = useState(false);
  const [inView, setInView] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setFinePointer(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) {
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setInView(!!e?.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const resetTilt = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!finePointer) {
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        x: Math.max(-1, Math.min(1, py)) * -7,
        y: Math.max(-1, Math.min(1, px)) * 9,
      });
    },
    [finePointer],
  );

  const tiltStyle: React.CSSProperties | undefined = finePointer
    ? detached
      ? {
          transform: `perspective(960px) translateY(-10px) rotateZ(-2.25deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)`,
          transition: "transform 80ms linear",
        }
      : {
          transform: `perspective(880px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)`,
          transition: "transform 80ms linear",
        }
    : detached
      ? {
          transform: "perspective(960px) translateY(-10px) rotateZ(-2.25deg) scale(1.02)",
        }
      : undefined;

  const driftOuter = !detached && !finePointer && inView ? "book-cover-drift" : "";
  const driftInner = detached && !finePointer && inView ? "book-cover-drift-inner" : "";

  const faceRadius = detached
    ? "rounded-[0.2rem_1.05rem_0.95rem_0.28rem]"
    : "rounded-[inherit] rounded-2xl md:rounded-3xl";

  const shellClass = detached
    ? `relative ${aspectClass} overflow-visible`
    : `relative ${aspectClass} overflow-hidden rounded-2xl bg-mist/40 md:rounded-3xl`;

  const frameClass = detached
    ? `book-detached-slab book-shaped-frame absolute inset-0 will-change-transform`
    : `book-shaped-frame absolute inset-0 will-change-transform ${driftOuter}`;

  return (
    <div
      ref={shellRef}
      className={shellClass}
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
    >
      <div className={frameClass} style={tiltStyle}>
        <div
          className={`relative h-full w-full overflow-hidden ${faceRadius} shadow-[inset_0_0_0_1px_rgba(58,54,48,0.07)] ${driftInner}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={sizes}
          />
        </div>
      </div>
    </div>
  );
}
