import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface RatingStarsProps {
  rating: number; // overall rating
  onRate?: (value: number) => void; // when user clicks
}

const RatingStars:React.FC<RatingStarsProps> = ({ rating = 0, onRate }) => {
const [hover, setHover] = useState<number|null>(null);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover ?? rating);
        return (
          <FaStar
            key={star}
            color={isActive ? "yellow" : "gray"}
            size={24}
            className={`cursor-pointer transition-colors duration-200 ${
              isActive ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
};
export default RatingStars;