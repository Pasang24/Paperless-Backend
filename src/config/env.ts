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
};
