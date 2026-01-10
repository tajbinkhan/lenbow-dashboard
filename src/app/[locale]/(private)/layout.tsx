import { getDeviceType } from "@/lib/get-device";

export default async function PrivateLayout({
	children,
	desktop,
	mobile
}: {
	children: React.ReactNode;
	desktop: React.ReactNode;
	mobile: React.ReactNode;
}) {
	// Get device type
	const deviceType = await getDeviceType();

	// Prefer device-specific slot; if it's empty, fall back to the other.
	return deviceType === "mobile" ? (mobile ?? desktop) : (desktop ?? mobile);
}
