export const route = {
	public: {},
	private: {
		dashboard: "/",
		profile: "/profile",
		settings: "/settings",
		requests: "/requests",
		borrow: "/borrow",
		lend: "/lend",
		repay: "/repay",
		history: "/history",
		notifications: "/notifications",
		support: "/support"
	},
	protected: {
		login: "/login"
	}
};

export const apiRoute = {
	csrf: "/csrf",
	googleLogin: "/auth/google",
	me: "/auth/me",
	logout: "/auth/logout",
	transactions: "/transactions",
	transaction: (transactionId: string) => `/transactions/${transactionId}`,
	requestedTransactions: "/transactions/requested",
	updatePendingTransactionRequest: (transactionId: string) =>
		`/transactions/${transactionId}/update-pending`,
	contact: (userId: string) => `/contacts/${userId}`,
	connectedContacts: "/contacts/connected"
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;

export { appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
