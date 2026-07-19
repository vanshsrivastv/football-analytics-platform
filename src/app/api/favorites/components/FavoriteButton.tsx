"use client";

import { useState } from "react";

export function FavoriteButton({
  teamId,
  initiallyFavorited,
}: {
  teamId: string;
  initiallyFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId }),
    });
    const result = await response.json();
    setFavorited(result.data.favorited);
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs"
      style={{ color: favorited ? "var(--color-accent)" : "var(--color-text-muted)" }}
    >
      {favorited ? "★ Favorited" : "☆ Favorite"}
    </button>
  );
}