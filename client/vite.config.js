import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    port: 3001,
    open: true,
    host: true,
});

// Fetch data from the API endpoint
// Convert the response to JSON
