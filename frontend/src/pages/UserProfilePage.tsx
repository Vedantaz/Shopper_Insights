import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import ProfileCard from "../components/ProfileCard";
import RatedStoreList from "./User/RatedStoreList";
import { useAuth } from "../auth/AuthContext";

interface RatedStore {
  store: { id: number; name: string; address: string };
  rating: number;
}

export default function UserProfilePage() {
  const { user } = useAuth();
  const [ratedStores, setRatedStores] = useState<RatedStore[]>([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axiosInstance.get("/ratings/get-all-ratings");
        setRatedStores(res.data); // assume API returns array of rated stores
      } catch (err) {
        console.error("Error fetching user ratings", err);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {user && <ProfileCard name={user.name} email={user.email} />}
      <h2 className="text-xl font-bold">Stores You Rated</h2>
      <RatedStoreList />
    </div>
  );
}
