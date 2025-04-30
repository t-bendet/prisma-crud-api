// import dotenv from "dotenv";
// import * as z from "zod";

// dotenv.config();

// const createEnv = () => {
//   const EnvSchema = z.object({
//     NODE_ENV: z.string(),
//     PORT: z.string(),
//     DATABASE: z.string(),
//     DATABASE_PASSWORD: z.string(),
//     USERNAME: z.string(),
//   });

//   const envVars = process.env;
//   const parsedEnv = EnvSchema.safeParse(envVars);

//   if (!parsedEnv.success) {
//     throw new Error(
//       `Invalid env provided.
//       The following variables are missing or invalid:
//     ${Object.entries(parsedEnv.error.flatten().fieldErrors)
//       .map(([k, v]) => `- ${k}: ${v}`)
//       .join("\n")}
//       `
//     );
//   }

//   return parsedEnv.data;
// };

// export const env = createEnv();
