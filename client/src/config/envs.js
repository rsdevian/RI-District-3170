const envs = {
    PORT: import.meta.env.VITE_PORT,
    NODE_ENV: import.meta.env.VITE_NODE_ENV,
    DEVELOPMENT_URL: import.meta.env.VITE_DEVELOPMENT_URL,
    PRODUCTION_URL: import.meta.env.VITE_PRODUCTION_URL,
};

export default envs;
