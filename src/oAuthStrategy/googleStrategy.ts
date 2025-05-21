import { GoogleProfile, GoogleToken } from "../types";
import { ApiError } from "../utils/ApiError";

export const googleStrategy = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
) => {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData: GoogleToken = await tokenRes.json();

  if (!tokenRes.ok || "error" in tokenData) {
    throw new ApiError(400, "Invalid or expired code");
  }

  const accessToken = tokenData.access_token;

  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  );

  const profile: GoogleProfile = await profileRes.json();

  return { name: profile.name, email: profile.email };
};
