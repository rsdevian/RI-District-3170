import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//config env variables
const configFn = () => config({ path: resolve(__dirname, "../local/.env") });

export { configFn };
