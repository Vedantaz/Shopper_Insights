import RatingStars from "../../components/RatingStars";
import { useRatings } from "../../auth/RatingsContext";

export default function RatedStoreList() {
  const { ratings } = useRatings();

  const ratedIds = Object.keys(ratings);

  if (ratedIds.length === 0) {
    return <p className="text-gray-500">You haven’t rated any stores yet.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {ratedIds.map((id) => (
        <div
          key={id}
          className="flex justify-between items-center p-4 border rounded shadow bg-white"
        >
          <span className="font-semibold">Store #{id}</span>
          <RatingStars storeId={parseInt(id)} readonly />
        </div>
      ))}
    </div>
  );
}
