import {
	Coins,
	FileText,
	Hand,
	History,
	LayoutDashboard,
	Settings,
	User,
	Users
} from "lucide-react";

import type { NavItemProps, NavUserMaxItemProps } from "@/layout/Desktop/Layout.types";
import { route } from "@/routes/routes";

const userItems: NavUserMaxItemProps = [
	{ title: "Profile", url: route.private.profile, icon: User },
	{ title: "Settings", url: route.private.settings, icon: Settings }
];

const navItem: NavItemProps[] = [
	{
		title: "Dashboard",
		url: route.private.dashboard,
		icon: LayoutDashboard
		// items: [{ title: "Profile", url: route.private.profile }],
	},
	{
		title: "Requests",
		url: route.private.requests,
		icon: FileText
	},
	{
		title: "Borrow",
		url: route.private.borrow,
		icon: Hand
	},
	{
		title: "Lend",
		url: route.private.lend,
		icon: Coins
	}
];

const navSupportingItem: NavItemProps[] = [
	{
		title: "History",
		url: route.private.history,
		icon: History
	},
	{
		title: "People",
		url: route.private.people,
		icon: Users
	}
	// {
	// 	title: "Notifications",
	// 	url: route.private.notifications,
	// 	icon: Bell
	// },
	// {
	// 	title: "Support",
	// 	url: route.private.support,
	// 	icon: HelpCircle
	// }
];

export { navItem, navSupportingItem, userItems };
