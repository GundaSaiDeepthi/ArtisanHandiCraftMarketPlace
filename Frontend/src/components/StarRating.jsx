import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = 18,
  interactive = false,
  onRatingChange,
}) => {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          alignItems: "center",
        }}
      >
        {stars.map((star) => {
          const isFilled = interactive
            ? star <= rating
            : star <= Math.round(rating);

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => {
                if (interactive && onRatingChange) {
                  onRatingChange(star);
                }
              }}
              style={{
                background: "none",
                border: "none",
                cursor: interactive ? "pointer" : "default",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.1s ease",
              }}
              className={interactive ? "star-btn" : ""}
            >
              <Star
                size={size}
                style={{
                  fill: isFilled ? "#facc15" : "none",
                  color: isFilled ? "#facc15" : "#9ca3af",
                  opacity: isFilled ? 1 : 0.5,
                }}
              />
            </button>
          );
        })}
      </div>

      <style>
        {`
          .star-btn:hover {
            transform: scale(1.2);
          }
        `}
      </style>
    </>
  );
};

export default StarRating;