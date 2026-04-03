export const route = {
	public: {
		offline: "/offline"
	},
	private: {
		dashboard: "/",
		profile: "/profile",
		settings: "/settings",
		requests: "/requests",
		borrow: "/borrow",
		lend: "/lend",
		repay: "/repay",
		history: "/history",
		people: "/people",
		notifications: "/notifications",
		support: "/support"
	},
	protected: {
		login: "/login"
	}
};

export const apiRoute = {
	csrf: "/csrf",
	login: "/auth/login",
	googleLogin: "/auth/google",
	me: "/auth/me",
	logout: "/auth/logout",
	updateProfile: "/auth/profile",
	updateProfileImage: "/auth/profile/image",
	updateEmailPreferences: "/auth/email-preferences",
	unsubscribe: (token: string) => `/auth/unsubscribe/${token}`,
	changePassword: "/auth/change-password",
	toggle2FA: "/auth/2fa",
	deleteAccount: "/auth/account",
	currency: "/currency",
	transactions: "/transactions",
	transaction: (transactionId: string) => `/transactions/${transactionId}`,
	requestedTransactions: "/transactions/requested",
	updateTransactionRequest: (transactionId: string) => `/transactions/${transactionId}/update`,
	updateTransactionStatus: (transactionId: string) => `/transactions/${transactionId}/status`,
	acceptRequestRepaymentTransaction: (transactionId: string) =>
		`/transactions/${transactionId}/repayment/accept`,
	rejectRequestRepaymentTransaction: (transactionId: string) =>
		`/transactions/${transactionId}/repayment/reject`,
	lenderRepaymentTransaction: (transactionId: string) =>
		`/transactions/${transactionId}/repayment/lender`,
	contacts: "/contacts",
	contact: (userId: string) => `/contacts/${userId}`,
	connectedContacts: "/contacts/connected",
	overview: "/overview",
	transactionHistory: "/history/transactions"
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;

export { appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
