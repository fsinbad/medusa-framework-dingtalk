import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: [
		"better-sqlite3",
		"@medusajs/framework",
		"@medusajs/workflows-sdk",
		"@medusajs/utils",
		"@medusajs/deps",
	],
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			oracledb: false,
			"mariadb/callback": false,
		};

		return config;
	},
};

export default nextConfig;
