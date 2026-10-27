import { createHash, createHmac } from "crypto";

/**
 * librespot's own ("keymaster") Spotify client ID. Spotify's login5 and Connect backends
 * only accept sessions authenticated with tokens issued to Spotify's own clients, so the
 * bot cannot use tokens from a third-party developer app. This client only allows the
 * loopback redirect below, which is why users paste the redirect URL back into this page.
 */
export const LIBRESPOT_CLIENT_ID =
  process.env.SPOTIFY_OAUTH_CLIENT_ID || "65b708073fc0480ea92a077233ca87bd";
export const LIBRESPOT_REDIRECT_URI =
  process.env.SPOTIFY_OAUTH_REDIRECT_URI || "http://127.0.0.1:8898/login";
export const SPOTIFY_SCOPES = ["streaming", "user-read-private", "user-read-email"];

/** Deterministic PKCE verifier derived from the link request token, so nothing has to be stored. */
export function codeVerifier(state: string): string {
  const secret = process.env.PKCE_SECRET || process.env.DISCORD_TOKEN || "spoticord";
  return createHmac("sha256", secret).update(state).digest("hex"); // 64 chars, valid PKCE charset
}

export function codeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LIBRESPOT_CLIENT_ID,
    redirect_uri: LIBRESPOT_REDIRECT_URI,
    scope: SPOTIFY_SCOPES.join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge(codeVerifier(state)),
    show_dialog: "true",
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function requestAccessToken(code: string, state: string) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: LIBRESPOT_REDIRECT_URI,
    client_id: LIBRESPOT_CLIENT_ID,
    code_verifier: codeVerifier(state),
  });

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  }).then((resp) => resp.json());

  if (result && "error" in result) {
    console.error("Spotify token exchange failed:", JSON.stringify(result), {
      redirect_uri: LIBRESPOT_REDIRECT_URI,
      client_id: LIBRESPOT_CLIENT_ID,
    });
  }

  return result;
}

/**
 * Fetch the user's profile. librespot's client ID is shared by every librespot user, so
 * Spotify's Web API frequently answers 429 for it; we retry briefly and otherwise give up.
 * Returns null when the profile could not be read. The bot records the real username on
 * its first login, so this is best-effort only.
 */
export async function getCurrentUser(
  token: string,
): Promise<{ id: string; product?: string } | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      return response.json();
    }

    const body = await response.text();
    console.error(`Spotify /v1/me failed (${response.status}):`, body);

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after") ?? "0");
      if (retryAfter > 0 && retryAfter <= 5) {
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
    }

    break;
  }

  return null;
}
