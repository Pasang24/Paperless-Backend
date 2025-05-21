import { GitHubEmail, GitHubProfile, GitHubToken } from "../types";
import { ApiError } from "../utils/ApiError";

export const githubStrategy = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
) => {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData: GitHubToken = await tokenRes.json();

  if (!tokenRes.ok || "error" in tokenData) {
    throw new ApiError(400, "Invalid or expired code");
  }

  const accessToken = tokenData.access_token;

  const profileRes = await fetch("https://api.github.com/user", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  const profile: GitHubProfile = await profileRes.json();

  if (!profile.email) {
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const emailList: GitHubEmail[] = await emailRes.json();

    const primaryEmail = emailList.find(
      (emailItem) => emailItem.primary && emailItem.verified
    )!;

    profile.email = primaryEmail.email;
  }

  return { name: profile.name ?? profile.login, email: profile.email };
};
