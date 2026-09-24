import "@mui/material/styles/createPalette";

type SurfaceTokens = { main: string; secondary: string; elevated: string };
type BorderTokens = { main: string; secondary: string; strong: string };

type QuantumTokens = {
	colors: import("./tokens").ColorTokens;
	shadows: { subtle: string; medium: string; strong: string };
	radii: typeof import("./tokens").radii;
	layout: typeof import("./tokens").layout;
};

declare module "@mui/material/styles" {
	interface Theme {
		tokens: QuantumTokens;
	}
	interface ThemeOptions {
		tokens?: QuantumTokens;
	}
	interface Palette {
		border: BorderTokens;
		surface: SurfaceTokens;
		tertiary: { main: string; contrastText: string };
	}
	interface PaletteOptions {
		border?: Partial<BorderTokens>;
		surface?: Partial<SurfaceTokens>;
		tertiary?: { main?: string; contrastText?: string };
	}
}

declare module "@mui/material/styles/createPalette" {
	interface TypeText {
		tertiary: string;
		placeholder: string;
		secondaryLight: string;
		"brand-tertiary": string;
		"brand-secondary": string;
	}
	interface TypeBackground {
		brand: string;
		"brand-secondary": string;
		"brand-section": string;
	}
}
