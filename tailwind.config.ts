import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				muted: "var(--muted)",
				surface: "var(--surface)",
				"surface-strong": "var(--surface-strong)",
				accent: "var(--accent)",
				"accent-strong": "var(--accent-strong)",
				border: "var(--border)",
			},
			fontFamily: {
				sans: ["var(--font-body)", "sans-serif"],
				serif: ["var(--font-display)", "serif"],
				mono: ["var(--font-mono)", "monospace"],
			},
		},
	},
	plugins: [],
};

export default config;
