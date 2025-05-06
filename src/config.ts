interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_SCORHEGAMI_API_URL || "http://127.0.0.1:8000",
};

export default config;
