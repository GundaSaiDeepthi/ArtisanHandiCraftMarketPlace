import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = 18,
  interactive = false,
  onRatingChange,
}) => {
  const stars = Array.from(
    { length: maxRating },
    (_, index) => index + 1
  );

  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${rating} out of ${maxRating}`}
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
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            onClick={() =>
              interactive &&
              onRatingChange?.(star)
            }
            className={`flex items-center justify-center transition-all duration-200 ${
              interactive
                ? "cursor-pointer hover:scale-125 active:scale-110"
                : "cursor-default"
            }`}
          >
            <Star
              size={size}
              className={`transition-all duration-200 ${
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-slate-500"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;