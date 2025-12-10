import { defineConfig } from "@solidjs/start/config";
import netlify from "@solidjs/start/netlify";

export default defineConfig({
    server: {
        adapter: netlify()
    }
});
