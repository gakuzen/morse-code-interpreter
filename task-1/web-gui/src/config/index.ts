const env: string = process.env.NODE_ENV || "production";

interface IConfig {
  env: string;
  socketUrl: string;
  apiUrl: string;
  authApiUrl: string;
}

interface IConfigs {
  [env: string]: IConfig;
}

const configs: IConfigs = {
  development: {
    env: "development",
    socketUrl: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api",
    authApiUrl: "http://localhost:3000/auth",
  },
  test: {
    env: "test",
    socketUrl: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api",
    authApiUrl: "http://localhost:3000/auth",
  },
  production: {
    env: "production",
    socketUrl: "",
    apiUrl: "",
    authApiUrl: "",
  },
};

export default configs[env];
