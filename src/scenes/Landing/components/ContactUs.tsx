"use client";
import PageContainer from "@/components/PageContainer";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/system";
import {
	StyledContactUsText,
	StyledSectionTitle,
	StyledSubTitle,
} from "./Styled";

const StyledBox = styled(Box)(({ theme }) => ({
	padding: "28px 24px",
	border: `1px solid ${theme.palette.border?.secondary || "#EAECF0"}`,
	borderRadius: "16px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	gap: "16px",
	width: "240px",
	backgroundColor: "#FFFFFF",
	boxShadow:
		"0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
	transition: "all 0.25s ease",
	"&:hover": {
		boxShadow:
			"0px 8px 24px rgba(16, 24, 40, 0.08), 0px 4px 12px rgba(16, 24, 40, 0.04)",
		transform: "translateY(-4px)",
		borderColor: theme.palette.primary?.main || "#0088DD",
	},
	[theme.breakpoints.down("sm")]: {
		padding: "20px 16px",
		width: "100%",
		maxWidth: "280px",
	},
}));

export default function ContactUs(props: {
	whatsappNumber?: string;
	address?: string;
	email?: string;
}) {
	const { whatsappNumber, address, email } = props;
	return (
		<PageContainer
			sx={{
				minHeight: "auto !important",
			}}
			id='contact'
		>
			<Stack
				justifyContent={"center"}
				alignItems={"center"}
				py={{ xs: 8, md: 10 }}
				spacing={{
					xs: 4,
					sm: 6,
				}}
			>
				<Box>
					<StyledSectionTitle
						color={"#fff"}
						sx={{
							textAlign: "center",
							color: "primary.main",
							fontWeight: 700,
						}}
					>
						إبق على تواصل معنا{" "}
					</StyledSectionTitle>
					<StyledSubTitle
						sx={(theme) => ({
							color: "text.tertiary",
							mt: 1.5,
							textAlign: "center",
							fontWeight: 500,
							fontSize: theme.typography.pxToRem(18),
							lineHeight: 1.5,
							[theme.breakpoints.down("sm")]: {
								fontSize: theme.typography.pxToRem(16),
							},
						})}
					>
						لا تتردد في التواصل معنا لأي استفسار أو مساعدة
					</StyledSubTitle>
				</Box>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					flexWrap={"wrap"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<StyledBox>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: "12px",
								backgroundColor: "rgba(0, 136, 221, 0.08)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<EmailOutlinedIcon
								sx={{
									color: "primary.main",
									fontSize: 24,
								}}
							/>
						</Box>
						<StyledSubTitle
							sx={{
								color: "text.primary",
								fontWeight: 600,
								fontSize: "1rem",
							}}
						>
							البريد الإلكتروني
						</StyledSubTitle>
						<Box>
							<StyledContactUsText
								component={"a"}
								href={`mailto:${email}`}
								target='_blank'
								sx={{
									fontSize: "14px",
									lineHeight: "20px",
									color: "primary.main",
								}}
							>
								{email}
							</StyledContactUsText>
						</Box>
					</StyledBox>
					<StyledBox>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: "12px",
								backgroundColor: "rgba(0, 136, 221, 0.08)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<PlaceOutlinedIcon
								sx={{
									color: "primary.main",
									fontSize: 24,
								}}
							/>
						</Box>
						<StyledSubTitle
							sx={{
								color: "text.primary",
								fontWeight: 600,
								fontSize: "1rem",
							}}
						>
							العنوان
						</StyledSubTitle>
						<StyledContactUsText
							sx={{
								color: "text.primary",
								fontSize: "14px",
							}}
						>
							{address}
						</StyledContactUsText>
					</StyledBox>
					<StyledBox>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: "12px",
								backgroundColor: "rgba(37, 211, 102, 0.08)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<WhatsAppIcon
								sx={{
									color: "#25D366",
									fontSize: 24,
								}}
							/>
						</Box>
						<StyledSubTitle
							sx={{
								color: "text.primary",
								fontWeight: 600,
								fontSize: "1rem",
							}}
						>
							الواتساب
						</StyledSubTitle>
						<StyledContactUsText
							component={"a"}
							href={`https://wa.me/${whatsappNumber}`}
							target='_blank'
							rel='noopener noreferrer'
							sx={{
								color: "primary.main",
								fontSize: "14px",
							}}
						>
							<span dir='ltr'>+{whatsappNumber}</span>
						</StyledContactUsText>
					</StyledBox>
				</Stack>
			</Stack>
		</PageContainer>
	);
}
