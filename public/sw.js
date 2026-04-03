const CACHE_VERSION = "lenbow-pwa-v1";
const PRECACHE_NAME = `${CACHE_VERSION}-precache`;
const ASSET_CACHE_NAME = `${CACHE_VERSION}-assets`;
const OFFLINE_DOCUMENT = "/offline.html";

const PRECACHE_URLS = [
	OFFLINE_DOCUMENT,
	"/favicon.ico",
	"/manifest.webmanifest",
	"/pwa/apple-touch-icon.png",
	"/pwa/icon-192x192.png",
	"/pwa/icon-512x512.png",
	"/pwa/icon-maskable-512x512.png"
];

const STATIC_ASSET_PATTERN =
	/\.(?:css|js|mjs|json|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)$/i;

self.addEventListener("install", event => {
	event.waitUntil(
		caches
			.open(PRECACHE_NAME)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", event => {
	event.waitUntil(
		caches
			.keys()
			.then(cacheNames =>
				Promise.all(
					cacheNames
						.filter(cacheName => ![PRECACHE_NAME, ASSET_CACHE_NAME].includes(cacheName))
						.map(cacheName => caches.delete(cacheName))
				)
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", event => {
	const { request } = event;

	if (request.method !== "GET") {
		return;
	}

	const url = new URL(request.url);

	if (url.origin !== self.location.origin) {
		return;
	}

	if (request.mode === "navigate") {
		event.respondWith(handleNavigationRequest(request));
		return;
	}

	if (
		url.pathname.startsWith("/_next/static/") ||
		url.pathname.startsWith("/_next/image") ||
		url.pathname.startsWith("/pwa/") ||
		url.pathname === "/favicon.ico" ||
		url.pathname === "/manifest.webmanifest" ||
		STATIC_ASSET_PATTERN.test(url.pathname)
	) {
		event.respondWith(handleAssetRequest(event, request));
	}
});

async function handleNavigationRequest(request) {
	try {
		return await fetch(request);
	} catch (error) {
		const precache = await caches.open(PRECACHE_NAME);
		const offlineResponse = await precache.match(OFFLINE_DOCUMENT, {
			ignoreSearch: true
		});

		if (offlineResponse) {
			return offlineResponse;
		}

		throw error;
	}
}

async function handleAssetRequest(event, request) {
	const cache = await caches.open(ASSET_CACHE_NAME);
	const cachedResponse = await cache.match(request);

	const networkFetch = fetch(request)
		.then(response => {
			if (response && response.ok) {
				event.waitUntil(cache.put(request, response.clone()));
			}

			return response;
		})
		.catch(async () => cachedResponse);

	if (cachedResponse) {
		event.waitUntil(networkFetch);
		return cachedResponse;
	}

	const response = await networkFetch;
	return response || Response.error();
}
