export const Envs = [
  "AI_WHITELIST",
  "ALLOWED_GROUPS",
  "AUTO_SEEN_GROUPS",
  "HANDLERS",
  "OPENAI_API_KEY",
  "SESSION_NAME",
] as const;
export type Envs = (typeof Envs)[number];

export const getEnv = (env: Envs) => process.env[env];

export const printEnvs = () => {
  Envs.forEach((env) => {
    console.log(`${env}: ${getEnv(env)}`);
  });
}