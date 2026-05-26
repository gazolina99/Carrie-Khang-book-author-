"use client";

import { useState } from "react";
import { STAR_PATH } from "@/components/star-rating-display";

type StarLook = "empty" | "bright" | "preview" | "ghost";

function starLook(n: number, clamped: number, hover: number | null): StarLook {
  const hasHover = hover !== null;
  const shown = hover ?? clamped;

  if (n > shown) {
    if (hasHover && hover! < clamped && n <= clamped) return "ghost";
    return "empty";
  }

  if (!hasHover) return "bright";

  if (hover === clamped) return n <= clamped ? "bright" : "empty";

  if (hover! > clamped) {
    if (n <= clamped) return "bright";
    return "preview";
  }

  if (n <= hover!) return "preview";
  if (n <= clamped) return "ghost";
  return "empty";
}

const STAR_PATH_CLASS: Record<StarLook, string> = {
  bright:
    "fill-rose-deep stroke-[#a85d78] stroke-[0.55] drop-shadow-[0_0_18px_rgba(232,188,201,0.9)]",
  preview: "fill-rose-deep/45 stroke-rose-deep/35 stroke-[0.45]",
  ghost: "fill-rose-deep/18 stroke-line/55 stroke-[1.1]",
  empty: "fill-none stroke-line/85 stroke-[1.35]",
};

type StarRatingPickerProps = {
  value: number;
  onValueChange: (rating: number) => void;
  /** When set, a hidden input is rendered for native form posts. */
  name?: string;
  /** ID of a visible label element (e.g. “Rating”). */
  labelledBy?: string;
  max?: number;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
};

export function StarRatingPicker({
  value,
  onValueChange,
  name,
  labelledBy,
  max = 5,
  size = "md",
  disabled,
  className = "",
}: StarRatingPickerProps) {
  const [hover, setHover] = useState<number | null>(null);
  const clamped = Math.min(max, Math.max(1, Math.round(value)));
  const dim = size === "sm" ? "h-4 w-4" : "h-7 w-7";

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      {name ? <input type="hidden" name={name} value={String(clamped)} /> : null}
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : "Rating"}
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const look = starLook(n, clamped, hover);
          const pathClass = STAR_PATH_CLASS[look];
          const svgExtra =
            look === "bright"
              ? " scale-[1.06] transition-transform duration-150"
              : " transition-transform duration-150";
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={clamped === n}
              disabled={disabled}
              aria-label={`Set rating to ${n} out of ${max} stars`}
              className="rounded-lg p-1.5 text-ink transition enabled:hover:bg-mist/60 enabled:focus-visible:outline-none enabled:focus-visible:ring-2 enabled:focus-visible:ring-[var(--accent)] enabled:focus-visible:ring-offset-2 disabled:opacity-50"
              onMouseEnter={() => setHover(n)}
              onClick={() => onValueChange(n)}
            >
              <svg
                viewBox="0 0 20 20"
                className={`${dim} shrink-0 origin-center will-change-transform${svgExtra}`}
                aria-hidden
              >
                <path
                  d={STAR_PATH}
                  className={`${pathClass} transition-[fill,stroke,filter] duration-150`}
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-ink-muted" aria-live="polite">
        {clamped} out of {max} stars
      </p>
    </div>
  );
}
