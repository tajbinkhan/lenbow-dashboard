import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Lenbow",
		short_name: "Lenbow",
		description: "A comprehensive loan management application to streamline your lending processes.",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#6d28d9",
		orientation: "portrait",
		icons: [
			{
				src: "/pwa/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any"
			},
			{
				src: "/pwa/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any"
			},
			{
				src: "/pwa/icon-maskable-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable"
			}
		]
	};
}
