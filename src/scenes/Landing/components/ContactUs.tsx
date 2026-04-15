"use client";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { alpha, Box, Stack, Typography } from "@mui/material";
import {
	SectionContainer,
	SectionLabel,
	SectionStack,
	SectionSubtitle,
	SectionTitle,
} from "./Styled";

interface ContactCardProps {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
	href?: string;
	accentColor: string;
}

function ContactCard({
	icon,
	label,
	value,
	href,
	accentColor,
}: ContactCardProps) {
	const content = (
		<Stack
			alignItems='center'
			spacing={2.5}
			sx={{
				p: { xs: 3, sm: 4 },
				borderRadius: "20px",
				backgroundColor: "#FFFFFF",
				border: "1px solid #EAECF0",
				boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				cursor: href ? "pointer" : "default",
				textDecoration: "none",
				color: "inherit",
				height: "100%",
				"&:hover": {
					borderColor: alpha(accentColor, 0.35),
					boxShadow: `0 8px 30px ${alpha(accentColor, 0.12)}`,
					transform: "translateY(-4px)",
				},
			}}
		>
			<Box
				sx={{
					width: 56,
					height: 56,
					borderRadius: "16px",
					backgroundColor: alpha(accentColor, 0.08),
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{icon}
			</Box>
			<Typography
				sx={{
					fontWeight: 700,
					fontSize: "1rem",
					color: "text.primary",
				}}
			>
				{label}
			</Typography>
			<Typography
				sx={{
					fontSize: "0.9375rem",
					color: "text.tertiary",
					textAlign: "center",
					lineHeight: 1.6,
					direction: "ltr",
				}}
			>
				{value}
			</Typography>
		</Stack>
	);

	if (href) {
		return (
			<Box
				component='a'
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				sx={{
					textDecoration: "none",
					color: "inherit",
					flex: { xs: "1 1 100%", sm: "1 1 0" },
					maxWidth: { sm: 300 },
				}}
			>
				{content}
			</Box>
		);
	}

	return (
		<Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 0" }, maxWidth: { sm: 300 } }}>
			{content}
		</Box>
	);
}

export default function ContactUs(props: {
	whatsappNumber?: string;
	address?: string;
	email?: string;
}) {
	const { whatsappNumber, address, email } = props;

	return (
		<Box
			id='contact'
			sx={{
				backgroundColor: "#FFFFFF",
				position: "relative",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 1,
					backgroundColor: "#EAECF0",
				},
			}}
		>
			<SectionContainer sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
				<SectionStack>
					<Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
						<SectionLabel>تواصل معنا</SectionLabel>
						<SectionTitle>إبق على تواصل معنا</SectionTitle>
						<SectionSubtitle>
							لا تتردد في التواصل معنا لأي استفسار أو مساعدة
						</SectionSubtitle>
					</Box>

					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={3}
						justifyContent='center'
						alignItems={{ xs: "stretch", sm: "stretch" }}
						sx={{ maxWidth: 960, mx: "auto", width: "100%" }}
					>
						<ContactCard
							icon={
								<EmailOutlinedIcon sx={{ color: "#0088DD", fontSize: 26 }} />
							}
							label='البريد الإلكتروني'
							value={email}
							href={`mailto:${email}`}
							accentColor='#0088DD'
						/>
						<ContactCard
							icon={
								<PlaceOutlinedIcon sx={{ color: "#0088DD", fontSize: 26 }} />
							}
							label='العنوان'
							value={address}
							accentColor='#0088DD'
						/>
						<ContactCard
							icon={<WhatsAppIcon sx={{ color: "#25D366", fontSize: 26 }} />}
							label='واتساب'
							value={<span dir='ltr'>+{whatsappNumber}</span>}
							href={`https://wa.me/${whatsappNumber}`}
							accentColor='#25D366'
						/>
					</Stack>
				</SectionStack>
			</SectionContainer>
		</Box>
	);
}
