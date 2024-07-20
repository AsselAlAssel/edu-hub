import { Menu } from "@/types/menu";

export const menuData: Menu[] = [
	{
		id: 1,
		title: "Features",
		newTab: false,
		path: "#features",
	},
	{
		id: 2,
		title: "Pricing",
		newTab: false,
		path: "#pricing",
	},
	{
		id: 2,
		title: "Blog",
		newTab: false,
		path: "/blog",
	},

	{
		id: 2,
		title: "Pages",
		newTab: false,
		submenu: [
			{
				id: 301,
				title: "Blog",
				newTab: false,
				path: "/blog",
			},
			{
				id: 304,
				title: "Sign In",
				newTab: false,
				path: "/auth/signin",
			},
			{
				id: 305,
				title: "Sign Up",
				newTab: false,
				path: "/auth/signup",
			},
			{
				id: 306,
				title: "404 Errors",
				newTab: false,
				path: "/error",
			},
			{
				id: 303,
				title: "Support",
				newTab: false,
				path: "/support",
			},
			{
				id: 301,
				title: "Blog Details",
				newTab: false,
				path: "/blog/proin-ac-ipsum-et-neque-tincidunt-aliquam-ut-ut-ex-in-viverra",
			},
		],
	},

	{
		id: 4,
		title: "Buy Now ↗",
		newTab: true,
		path: "https://saasbold.com/#pricing",
	},
];
