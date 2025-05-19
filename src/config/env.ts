import "dotenv/config";

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value!;
}

export const env = {
  PORT: Number(getEnvVariable("PORT", false)) || 4000,
  NODE_ENV: getEnvVariable("NODE_ENV"),
  DATABASE_URL: getEnvVariable("DATABASE_URL"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET"),
  GITHUB_CLIENT_ID: getEnvVariable("GITHUB_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: getEnvVariable("GITHUB_CLIENT_SECRET"),
  BACKEND_URL: getEnvVariable("BACKEND_URL", false),
  FRONTEND_URL: getEnvVariable("FRONTEND_URL", false),
};
