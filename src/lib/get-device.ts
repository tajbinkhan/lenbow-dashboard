import { headers } from "next/headers";

export async function getDeviceType(): Promise<"mobile" | "desktop"> {
	const headersList = await headers();
	const deviceType = headersList.get("x-device-type");
	return deviceType === "mobile" ? "mobile" : "desktop";
}

export async function isMobile(): Promise<boolean> {
	const deviceType = await getDeviceType();
	return deviceType === "mobile";
}
