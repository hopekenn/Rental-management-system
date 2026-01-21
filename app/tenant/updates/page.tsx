"use client";

import { useEffect, useState } from "react";
import type { Update } from "@/app/types/data";

const Updates = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = async () => {
    try {
      const response = await fetch("/api/updates", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch updates");
      }

      const data: Update[] = await response.json();
      setUpdates(data);
    } catch (err) {
      console.error("Error fetching updates", err);
      setError("Could not load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  if (loading) {
    return <p className="p-4 text-gray-400">Loading updates…</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  if (updates.length === 0) {
    return <p className="p-4 text-gray-400">No announcements yet</p>;
  }

  return (
    <div>
      <h3 className="font-semibold text-blue-700 p-3">
        ANNOUNCEMENTS FROM LANDLORD
      </h3>

      <div className="space-y-4">
        {updates.map((item) => (
          <div
            key={item._id}
            className="border border-gray-700 p-4 rounded bg-gray-900"
          >
            <h3 className="font-semibold text-white">{item.update}</h3>

            <p className="text-sm text-gray-300 mt-1">
              {item.description}
            </p>

            <small className="text-xs text-gray-400 block mt-2">
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Updates;
