"use client";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { alpha, Box, Stack, Typography } from "@mui/material";
import {
	AnimatedSection,
	GlowOrb,
	MotionBox,
	StaggerGroup,
	StaggerItem,
} from "./MotionComponents";

interface ContactCardProps {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
	href?: string;
	accentColor: string;
	glowColor: string;
}

function ContactCard({
	icon,
	label,
	value,
	href,
	accentColor,
	glowColor,
}: ContactCardProps) {
	const content = (
		<MotionBox
			whileHover={{ y: -6, scale: 1.03 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<Stack
				alignItems='center'
				spacing={2.5}
				sx={(theme) => {
					const isLight = theme.palette.mode === "light";
					return {
						p: { xs: 3.5, sm: 4 },
						borderRadius: "20px",
						backgroundColor: "#FFFFFF",
						border: "1px solid",
						borderColor: "#E2E8F0",
						boxShadow: isLight
							? "0 1px 2px rgba(15,23,42,0.03), 0 2px 8px rgba(15,23,42,0.02)"
							: "0 1px 2px rgba(0,0,0,0.04), 0 3px 10px rgba(0,0,0,0.025)",
						transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
						cursor: href ? "pointer" : "default",
						textDecoration: "none",
						color: "inherit",
						height: "100%",
						"&:hover": {
							borderColor: accentColor,
							boxShadow: isLight
								? `0 4px 14px ${alpha(accentColor, 0.06)}, 0 2px 6px rgba(15,23,42,0.03)`
								: `0 8px 28px ${glowColor}, 0 3px 12px rgba(0,0,0,0.04)`,
						},
					};
				}}
			>
				<Box
					sx={{
						width: 64,
						height: 64,
						borderRadius: "18px",
						background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
						border: `1px solid ${accentColor}20`,
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
						fontSize: "1.0625rem",
						color: "#1E293B",
					}}
				>
					{label}
				</Typography>
				<Typography
					sx={{
						fontSize: "0.9375rem",
						color: "#64748B",
						textAlign: "center",
						lineHeight: 1.7,
						direction: "ltr",
						fontWeight: 500,
					}}
				>
					{value}
				</Typography>
			</Stack>
		</MotionBox>
	);

	if (href) {
		return (
			<Box
				component='a'
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				sx={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 0 }}
			>
				{content}
			</Box>
		);
	}

	return <Box sx={{ flex: 1, minWidth: 0 }}>{content}</Box>;
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
				position: "relative",
				overflow: "hidden",
				background:
					"linear-gradient(180deg, #F0F7FF 0%, #F8FAFC 40%, #FFFFFF 100%)",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 1,
					background:
						"linear-gradient(90deg, transparent 0%, #D0D5DD 50%, transparent 100%)",
				},
			}}
		>
			<GlowOrb
				color='rgba(0,136,221,0.06)'
				size={400}
				top='-10%'
				right='5%'
				delay={1}
			/>
			<GlowOrb
				color='rgba(124,58,237,0.04)'
				size={350}
				bottom='-10%'
				left='5%'
				delay={3}
			/>

			<Box
				sx={{
					maxWidth: 1200,
					mx: "auto",
					width: "100%",
					px: { xs: 3, sm: 4, md: 6 },
				}}
			>
				<Stack
					sx={{
						py: { xs: 10, sm: 12, md: 14 },
						position: "relative",
					}}
				>
					<AnimatedSection
						viewportAmount={0.2}
						viewportMargin='0px'
						sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}
					>
						<Typography
							sx={{
								fontSize: "0.8125rem",
								fontWeight: 700,
								letterSpacing: "0.12em",
								textTransform: "uppercase",
								color: "#0088DD",
								mb: 1.5,
							}}
						>
							تواصل معنا
						</Typography>
						<Typography
							sx={{
								fontSize: { xs: "1.75rem", sm: "2.125rem", md: "2.5rem" },
								fontWeight: 800,
								lineHeight: 1.15,
								letterSpacing: "-0.02em",
								color: "#0F172A",
								mb: 2,
							}}
						>
							إبق على تواصل معنا
						</Typography>
						<Typography
							sx={{
								fontSize: { xs: "1rem", sm: "1.125rem" },
								lineHeight: 1.7,
								color: "#475569",
								maxWidth: 540,
								mx: "auto",
							}}
						>
							لا تتردد في التواصل معنا لأي استفسار أو مساعدة
						</Typography>
					</AnimatedSection>

					<StaggerGroup
						viewportAmount={0.1}
						viewportMargin='0px'
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							gap: 3,
							justifyContent: "center",
							alignItems: { xs: "stretch", sm: "stretch" },
							maxWidth: 960,
							mx: "auto",
							width: "100%",
						}}
					>
						<StaggerItem sx={{ flex: 1, minWidth: 0 }}>
							<ContactCard
								icon={
									<EmailOutlinedIcon sx={{ color: "#0088DD", fontSize: 28 }} />
								}
								label='البريد الإلكتروني'
								value={email}
								href={`mailto:${email}`}
								accentColor='#0088DD'
								glowColor='rgba(0,136,221,0.12)'
							/>
						</StaggerItem>
						<StaggerItem sx={{ flex: 1, minWidth: 0 }}>
							<ContactCard
								icon={
									<PlaceOutlinedIcon sx={{ color: "#7C3AED", fontSize: 28 }} />
								}
								label='العنوان'
								value={address}
								accentColor='#7C3AED'
								glowColor='rgba(124,58,237,0.12)'
							/>
						</StaggerItem>
						<StaggerItem sx={{ flex: 1, minWidth: 0 }}>
							<ContactCard
								icon={<WhatsAppIcon sx={{ color: "#16A34A", fontSize: 28 }} />}
								label='واتساب'
								value={<span dir='ltr'>+{whatsappNumber}</span>}
								href={`https://wa.me/${whatsappNumber}`}
								accentColor='#16A34A'
								glowColor='rgba(22,163,74,0.12)'
							/>
						</StaggerItem>
					</StaggerGroup>
				</Stack>
			</Box>
		</Box>
	);
}
