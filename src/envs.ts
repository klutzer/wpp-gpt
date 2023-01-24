export const Envs = [
  "SESSION_NAME",
  "OPENAI_API_KEY",
  "ALLOWED_GROUPS",
] as const;
export type Envs = (typeof Envs)[number];

export const getEnv = (env: Envs) => process.env[env];

export const printEnvs = () => {
  Envs.forEach((env) => {
    console.log(`${env}: ${getEnv(env)}`);
  });
}