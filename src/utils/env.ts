import dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

type ConnectionString =
  `mongodb+srv://${string}:${string}@${string}/${string}?retryWrites=true&w=majority&appName=${string}`;

const connectionStringRegex =
  /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)\?retryWrites=true&w=majority&appName=([^&]+)$/;

const createEnv = () => {
  const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]),
    PORT: z.string(),
    DATABASE_URL: z.custom<ConnectionString>((val) =>
      connectionStringRegex.test(val as string)
    ),
  });

  const envVars = process.env;
  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
      The following variables are missing or invalid:
    ${Object.entries(parsedEnv.error.flatten().fieldErrors)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n")}
      `
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
