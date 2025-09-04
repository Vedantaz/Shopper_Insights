import RatingStars from "../../components/RatingStars";
import { useRatings } from "../../auth/RatingsContext";

export default function RatedStoreList() {
  const { ratings } = useRatings();

  const ratedIds = Object.keys(ratings);

  if (ratedIds.length === 0) {
    return <p className="text-gray-500">You haven’t rated any stores yet.</p>;
  }

  return (
    <>
      {Object.entries(ratings).map(([storeId, { name }]) => (
        <div className="mt-6 space-y-4">
          <div
            key={storeId}
            className="flex justify-between items-center p-4 border rounded shadow bg-white"
          >
            <span className="font-semibold">{name}</span>
            <RatingStars storeId={parseInt(storeId)} readonly />
          </div>
        </div>
      ))}
    </>
  );
}
