import type { PaletteOptions } from "@mui/material/styles";

export type EduColorMode = "light" | "dark";

export function getEduPalette(mode: EduColorMode): PaletteOptions {
	if (mode === "light") {
		return {
			mode: "light",
			primary: {
				main: "#0284C7",
				dark: "#0369A1",
				light: "#38BDF8",
				contrastText: "#FFFFFF",
			},
			secondary: {
				main: "#475569",
				light: "#64748B",
				dark: "#334155",
				contrastText: "#FFFFFF",
			},
			success: {
				main: "#059669",
				dark: "#047857",
				light: "#D1FAE5",
				contrastText: "#FFFFFF",
			},
			error: {
				main: "#DC2626",
				light: "#FECACA",
				dark: "#B91C1C",
				contrastText: "#FFFFFF",
			},
			warning: {
				main: "#D97706",
				light: "#FEF3C7",
				dark: "#B45309",
				contrastText: "#0F172A",
			},
			info: {
				main: "#2563EB",
				light: "#DBEAFE",
				dark: "#1D4ED8",
				contrastText: "#FFFFFF",
			},
			divider: "#E2E8F0",
			background: {
				default: "#F8FAFC",
				paper: "#FFFFFF",
				brand: "#0369A1",
				["brand-secondary"]: "#BAE6FD",
				["brand-section"]: "#F0F9FF",
			},
			text: {
				primary: "#0F172A",
				secondary: "#334155",
				secondaryLight: "#0284C7",
				tertiary: "#64748B",
				placeholder: "#94A3B8",
				["brand-tertiary"]: "#0369A1",
				["brand-secondary"]: "#0E7490",
			},
			border: {
				main: "#CBD5E1",
				secondary: "#E2E8F0",
			},
			tertiary: {
				main: "#6366F1",
				contrastText: "#FFFFFF",
			},
			action: {
				hover: "rgba(15, 23, 42, 0.04)",
				selected: "rgba(2, 132, 199, 0.08)",
			},
		};
	}

	return {
		mode: "dark",
		primary: {
			main: "#38BDF8",
			dark: "#0EA5E9",
			light: "#7DD3FC",
			contrastText: "#0B1220",
		},
		secondary: {
			main: "#94A3B8",
			light: "#CBD5E1",
			dark: "#64748B",
			contrastText: "#0B1220",
		},
		success: {
			main: "#34D399",
			dark: "#10B981",
			light: "#6EE7B7",
			contrastText: "#042F2E",
		},
		error: {
			main: "#F87171",
			light: "#FECACA",
			dark: "#EF4444",
			contrastText: "#0B1220",
		},
		warning: {
			main: "#FBBF24",
			light: "#FEF3C7",
			dark: "#F59E0B",
			contrastText: "#0B1220",
		},
		info: {
			main: "#60A5FA",
			light: "#DBEAFE",
			dark: "#3B82F6",
			contrastText: "#0B1220",
		},
		divider: "#273549",
		background: {
			default: "#0C111D",
			paper: "#151C28",
			brand: "#0EA5E9",
			["brand-secondary"]: "#164E63",
			["brand-section"]: "#111827",
		},
		text: {
			primary: "#F1F5F9",
			secondary: "#CBD5E1",
			secondaryLight: "#7DD3FC",
			tertiary: "#94A3B8",
			placeholder: "#78909C",
			["brand-tertiary"]: "#38BDF8",
			["brand-secondary"]: "#BAE6FD",
		},
		border: {
			main: "#334155",
			secondary: "#1E293B",
		},
		tertiary: {
			main: "#A5B4FC",
			contrastText: "#0B1220",
		},
		action: {
			hover: "rgba(241, 245, 249, 0.06)",
			selected: "rgba(56, 189, 248, 0.12)",
		},
	};
}
