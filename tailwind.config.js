import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}", // 👈 TypeScript support
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
