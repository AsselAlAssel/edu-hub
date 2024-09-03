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
	padding: "24px",
	border: `2px solid ${theme.palette.primary.main}`,
	borderRadius: "16px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	gap: "16px",
	width: "230px",
	[theme.breakpoints.down("sm")]: {
		padding: "16px",
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
				py={8}
				spacing={{
					xs: 3,
					sm: 5,
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
							color: "text.primary",
							mt: 2,
							textAlign: "center",
							fontWeight: 600,
							fontSize: theme.typography.pxToRem(24),
							lineHeight: theme.typography.pxToRem(28),
							[theme.breakpoints.down("sm")]: {
								fontSize: theme.typography.pxToRem(18),
								lineHeight: theme.typography.pxToRem(22),
							},
						})}
					>
						لا تتردد في التواصل معنا لأي استفسار أو مساعدة
					</StyledSubTitle>
				</Box>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={{
						xs: 3,
						sm: 5,
					}}
					flexWrap={"wrap"}
					justifyContent={"center"}
					alignItems={"center"}
					gap={3}
				>
					<StyledBox>
						<EmailOutlinedIcon
							sx={{
								color: "primary.main",
							}}
						/>
						<StyledSubTitle
							sx={{
								color: "primary.main",
								fontWeight: 600,
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
									fontSize: "15px",
									lineHeight: "18px",
								}}
							>
								{email}
							</StyledContactUsText>
						</Box>
					</StyledBox>
					<StyledBox>
						<PlaceOutlinedIcon
							sx={{
								color: "primary.main",
							}}
						/>
						<StyledSubTitle
							sx={{
								color: "primary.main",
								fontWeight: 600,
							}}
						>
							العنوان
						</StyledSubTitle>
						<StyledContactUsText>{address}</StyledContactUsText>
					</StyledBox>
					<StyledBox>
						<WhatsAppIcon
							sx={{
								color: "primary.main",
							}}
						/>
						<StyledSubTitle
							sx={{
								color: "primary.main",
								fontWeight: 600,
							}}
						>
							الواتساب
						</StyledSubTitle>
						<StyledContactUsText
							component={"a"}
							href={`https://wa.me/${whatsappNumber}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<span dir='ltr'>+{whatsappNumber}</span>
						</StyledContactUsText>
					</StyledBox>
				</Stack>
			</Stack>
		</PageContainer>
	);
}
