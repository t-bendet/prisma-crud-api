import dotenv from "dotenv";
import * as z from "zod";
import ms from "ms";

dotenv.config();

const msStringValue = z.custom<ms.StringValue>((val) => {
  try {
    return ms(val) && typeof val === "string";
  } catch {
    return false;
  }
}, "Invalid ms duration format");

type ConnectionString =
  `mongodb+srv://${string}:${string}@${string}/${string}?retryWrites=true&w=majority&appName=${string}`;

const connectionStringRegex =
  /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)\?retryWrites=true&w=majority&appName=([^&]+)$/;

// TODO refine validations
const createEnv = () => {
  const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]),
    PORT: z.string(),
    DATABASE_URL: z.custom<ConnectionString>((val) =>
      connectionStringRegex.test(val as string)
    ),
    JWT_SECRET: z.string().min(10),
    JWT_EXPIRES_IN: msStringValue,
    JWT_COOKIE_EXPIRES_IN: z.string(),
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
