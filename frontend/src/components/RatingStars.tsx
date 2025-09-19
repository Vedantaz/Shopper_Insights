import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useRatings } from "../auth/RatingsContext";
import axiosInstance from "../api/axios";
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
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ratingsFromContext = getRating(storeId);
    if (ratingsFromContext) {
      setCurrentRating(ratingsFromContext.value);
      return;
    }
    const fetchRating = async () => {
      try {
        const res = await axiosInstance.get(`/ratings/get-ratings-by-user`);
        if (res.data?.ratingsData) {
          const ratingForThisStore = res.data.ratingsData.find(
            (r: any) => r.storeId == storeId
          );
          if (ratingForThisStore) {
            setCurrentRating(ratingForThisStore.value);
          }
        }
      } catch (err) {
        console.error("Error fetching rating:", err);
      }
    };
    fetchRating();
  });

  const handleRating = async (value: number) => {
    if (readonly || loading) return;

    const prevRating = currentRating;
    setCurrentRating(value);
    setRating(storeId, value);

    try {
      setLoading(true);
      await axiosInstance.post(`/ratings/${storeId}/give-rating`, {
        value: value,
      });
    } catch (error) {
      console.error("Failed to submit rating:", error);
      setRating(storeId, currentRating);
      setCurrentRating(prevRating);
    } finally {
      setLoading(false);
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
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
};
export default RatingStars;
