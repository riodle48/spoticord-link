"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("Missing Spotify environment variables");
      return;
    }

    // Spotify scopes for full playback control
    const scopes = [
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-library-read",
      "user-library-modify"
    ];

    const state = searchParams.get("state") || "";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(
      clientId
    )}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(" "))}&state=${encodeURIComponent(
      state
    )}`;

    // Redirect to Spotify auth
    window.location.href = authUrl;
  }, [router, searchParams]);

  return <p>Redirecting to Spotify...</p>;
}

  
