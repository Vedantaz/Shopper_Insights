import React from "react";

interface RatingStarsProps {
  rating: number; // overall rating
  onRate?: (value: number) => void; // when user clicks
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, onRate }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
