import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	reactCompiler: true,
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com"
			}
		]
	},
	async headers() {
		return [
			{
				source: "/sw.js",
				headers: [
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate"
					},
					{
						key: "Service-Worker-Allowed",
						value: "/"
					}
				]
			}
		];
	}
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
