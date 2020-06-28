const env: string = process.env.NODE_ENV || "production";

interface Config {
  env: string;
  port: number;
}

interface Configs {
  [env: string]: Config;
}

const configs: Configs = {
  local: {
    env: "local",
    port: parseInt(process.env.PORT) || 3000,
  },
  test: {
    env: "test",
    port: parseInt(process.env.PORT) || 3000,
  },
  development: {
    env: "development",
    port: parseInt(process.env.PORT) || 3000,
  },
  staging: {
    env: "staging",
    port: parseInt(process.env.PORT) || 3000,
  },
  production: {
    env: "production",
    port: parseInt(process.env.PORT) || 3000,
  },
};

export default configs[env];
