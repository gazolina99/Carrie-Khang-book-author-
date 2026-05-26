/** Five-point star path (20×20 viewBox), solid silhouette. */
export const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";

type StarRatingDisplayProps = {
  value: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
};

export function StarRatingDisplay({
  value,
  max = 5,
  size = "md",
  className = "",
}: StarRatingDisplayProps) {
  const filled = Math.min(max, Math.max(0, Math.round(value)));
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${filled} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const isFilled = i < filled;
        return (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={`${dim} shrink-0`}
            aria-hidden
          >
            <path
              d={STAR_PATH}
              className={
                isFilled
                  ? "fill-rose-deep stroke-rose-deep stroke-[0.5]"
                  : "fill-none stroke-line/85 stroke-[1.35]"
              }
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}
