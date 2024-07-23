import "@mui/material/styles/createPalette";

declare module "@mui/material/styles" {
	interface Palette {
		border: {
			main: string;
			secondary: string;
		};
		text: {
			primary: string;
			secondary: string;
			secondaryLight: string;
			tertiary: string;
			placeholder: string;
			"brand-tertiary": string;
			"brand-secondary": string;
		};
		background: {
			brand: string;
			"brand-secondary": string;
			"brand-section": string;
		};
		tertiary: {
			main: string;
			contrastText: string;
		};
	}
	interface PaletteOptions {
		border?: {
			main?: string;
			secondary?: string;
		};
		text?: {
			primary?: string;
			secondary?: string;
			secondaryLight?: string;
			tertiary?: string;
			placeholder?: string;
			"brand-tertiary"?: string;
			"brand-secondary"?: string;
		};
		background?: {
			brand?: string;
			"brand-secondary"?: string;
			"brand-section"?: string;
		};
		tertiary?: {
			main?: string;
			contrastText?: string;
		};
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
