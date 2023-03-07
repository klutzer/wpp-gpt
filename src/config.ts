import { z } from "zod";

const ConfigKeys = [
  "AI_WHITELIST",
  "ALLOWED_GROUPS",
  "AUTO_SEEN_GROUPS",
  "CHAT_HISTORY_SIZE",
  "HANDLERS",
  "OPENAI_API_KEY",
  "SESSION_NAME",
] as const;
type ConfigKeys = (typeof ConfigKeys)[number];

const DECIMAL_RADIX = 10;

const stringCsvToArray = () =>
  z.string().optional().transform((data) => data?.split(",") ?? []);

const ConfigSchema = z.object({
  ai: z.object({
    whitelist: stringCsvToArray(),
    allowedGroups: stringCsvToArray(),
    chatHistorySize: z.string().default("3").transform((data) => parseInt(data, DECIMAL_RADIX)),
    openaiApiKey: z.string().nonempty(),
  }),
  autoSeenGroups: stringCsvToArray(),
  handlers: z.string().nonempty().transform((data) => data?.split(",") ?? []),
  sessionName: z.string().default("teste"),
});

export const Configs = ConfigSchema.parse({
  ai: {
    whitelist: process.env["AI_WHITELIST"],
    allowedGroups: process.env["ALLOWED_GROUPS"],
    chatHistorySize: process.env["CHAT_HISTORY_SIZE"],
    openaiApiKey: process.env["OPENAI_API_KEY"],
  },
  autoSeenGroups: process.env["AUTO_SEEN_GROUPS"],
  handlers: process.env["HANDLERS"],
  sessionName: process.env["SESSION_NAME"],
});

export const printConfigs = () => {
  ConfigKeys.forEach((env) => {
    console.log(`${env}: ${process.env[env]}`);
  });
}