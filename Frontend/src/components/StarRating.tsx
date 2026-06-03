import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 18,
  interactive = false,
  onRatingChange,
}) => {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
      {stars.map((star) => {
        // Handle fractional stars for display mode
        const isFilled = interactive ? star <= rating : star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            style={{
              background: "none",
              border: "none",
              cursor: interactive ? "pointer" : "default",
              padding: 0,
              display: "flex",
              transition: "transform 0.1s ease",
            }}
            className={interactive ? "star-btn" : ""}
          >
            <Star
              size={size}
              style={{
                fill: isFilled ? "var(--warning)" : "none",
                color: isFilled ? "var(--warning)" : "var(--muted-foreground)",
                opacity: isFilled ? 1 : 0.4,
              }}
            />
          </button>
        );
      })}
      <style>{`
        .star-btn:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};
