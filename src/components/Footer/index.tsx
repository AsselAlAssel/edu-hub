"use client";
import Logo from "@/components/AppShell/Logo";
import PageContainer from "@/components/PageContainer";
import { NAV_ITEMS } from "@/constants/navigation";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";

const SOCIAL_LINKS = [
	{
		label: "صفحة فيسبوك",
		href: "https://www.facebook.com/mhmd.anwr.sbh.2025",
		icon: <FacebookRoundedIcon />,
	},
	{
		label: "قناة يوتيوب",
		href: "https://www.youtube.com/@mohammadsubuh",
		icon: <YouTubeIcon />,
	},
];

export default function Footer() {
	return (
		<Box
			component='footer'
			sx={(theme) => ({
				mt: "auto",
				borderTop: `1px solid ${theme.tokens.colors.border}`,
				backgroundColor: theme.tokens.colors.surface,
			})}
		>
			<PageContainer sx={{ py: { xs: 5, md: 6 } }}>
				<Stack
					direction={{ xs: "column", md: "row" }}
					justifyContent='space-between'
					alignItems={{ xs: "flex-start", md: "center" }}
					gap={4}
				>
					<Stack spacing={1.5}>
						<Logo />
						<Typography
							variant='body2'
							sx={{ color: "text.secondary", maxWidth: 320 }}
						>
							شروحات الفيزياء لجميع الصفوف في مكانٍ واحد، من إعداد الأستاذ محمد
							صبح.
						</Typography>
					</Stack>

					<Box component='nav' aria-label='روابط التذييل'>
						<Stack
							component='ul'
							direction='row'
							flexWrap='wrap'
							columnGap={3}
							rowGap={1.5}
							sx={{ listStyle: "none", m: 0, p: 0 }}
						>
							{NAV_ITEMS.map((item) => (
								<li key={item.href}>
									<Box
										component={Link}
										href={item.href}
										sx={{
											color: "text.secondary",
											textDecoration: "none",
											fontWeight: 600,
											fontSize: "0.9375rem",
											"&:hover": { color: "primary.main" },
										}}
									>
										{item.label}
									</Box>
								</li>
							))}
						</Stack>
					</Box>
				</Stack>

				<Stack
					direction={{ xs: "column-reverse", sm: "row" }}
					justifyContent='space-between'
					alignItems={{ xs: "flex-start", sm: "center" }}
					gap={2}
					sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}
				>
					<Typography variant='caption' sx={{ color: "text.secondary" }}>
						© {new Date().getFullYear()} محمد صبح. جميع الحقوق محفوظة.
					</Typography>
					<Stack direction='row' gap={1}>
						{SOCIAL_LINKS.map((link) => (
							<IconButton
								key={link.href}
								component='a'
								href={link.href}
								target='_blank'
								rel='noopener noreferrer'
								aria-label={`${link.label} (يفتح في نافذة جديدة)`}
								sx={{
									border: 1,
									borderColor: "divider",
									"&:hover": { color: "primary.main" },
								}}
							>
								{link.icon}
							</IconButton>
						))}
					</Stack>
				</Stack>
			</PageContainer>
		</Box>
	);
}
