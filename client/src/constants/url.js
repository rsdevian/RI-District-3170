const development = true;

const developmentUrl = "http://localhost:3000";
const productionURL = "";

const env = development ? "Development" : "Production";
const URL = development ? developmentUrl : productionURL;

export { URL, env };
