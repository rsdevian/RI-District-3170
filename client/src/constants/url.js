const development = false;

const developmentUrl = "http://localhost:3000";
const productionURL = "https://docshub-dev-v12r.onrender.com";

const env = development ? "Development" : "Production";
const URL = development ? developmentUrl : productionURL;

export { URL, env };
