import { useMediaQuery, useTheme } from "@mui/material";

export const useMuiMediaQuery = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTabletOrLess = useMediaQuery(theme.breakpoints.down("md"));
	const isDesktopOrMore = useMediaQuery(theme.breakpoints.up("md"));
	const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

	return {
		isMobile,
		isTabletOrLess,
		isDesktopOrMore,
		isLargeDesktop,
	};
};

export default useMuiMediaQuery;
