"use server";

import { cookies } from "next/headers";

import { apiRoute } from "@/routes/routes";

const accessTokenName = "access-token";

// Cached function with explicit token parameter
async function fetchUserData(token: string): Promise<User | null> {
	"use cache";

	try {
		const url = `${process.env.NEXT_PUBLIC_API_URL}${apiRoute.me}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: `${accessTokenName}=${token}`
			},
			credentials: "include"
		});

		if (!response.ok) {
			return null;
		}
		const { data } = (await response.json()) as ApiResponse<User>;

		return data || null;
	} catch (error) {
		return null;
	}
}

// Export function that reads cookies and calls cached function
export async function fetchMe(): Promise<User | null> {
	const getCookies = await cookies();
	const accessToken = getCookies.get(accessTokenName)?.value;

	if (!accessToken) {
		return null;
	}

	return fetchUserData(accessToken);
}
