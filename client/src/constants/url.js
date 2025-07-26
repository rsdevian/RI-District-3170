import configs from "../config/envs";

const env = configs.NODE_ENV;

const URLs = {
    development: configs.DEVELOPMENT_URL,
    production: configs.PRODUCTION_URL,
};

const URL = URLs[env];

export { URL, env };
