import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useRatings } from "../auth/RatingsContext";
interface RatingStarsProps {
  storeId: number;
  readonly?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  storeId,
  readonly = false,
}) => {
  const { getRating, setRating } = useRatings();
  const [hover, setHover] = useState<number | null>(null);

  const currentRating = getRating(storeId) ?? 0;

  const handleClick = (star: number) => {
    if (!readonly) {
      setRating(storeId, star);
    }
  };
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover ?? currentRating);
        return (
          <FaStar
            key={star}
            color={isActive ? "yellow" : "gray"}
            size={24}
            className={`cursor-pointer transition-colors duration-200 ${
              isActive ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
};
export default RatingStars;
